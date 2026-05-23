import fs from 'fs';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import UploadedStatement from '../models/UploadedStatement.js';
import Expense from '../models/Expense.js';
import { parseCSVFile, detectCSVFormat, normalizeRows } from '../services/csvParserService.js';
import { categorizeAll, loadUserRules } from '../services/categorizationService.js';

export const processStatement = async (statementId, filePath, userId) => {
  try {
    const rows = await parseCSVFile(filePath);
    
    if (rows.length === 0) {
      await UploadedStatement.findByIdAndUpdate(statementId, {
        status: 'failed',
        errorMessage: 'CSV file is empty or has no data rows'
      });
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return;
    }

    const headers = Object.keys(rows[0]);
    const format = detectCSVFormat(headers);
    const normalizedRows = normalizeRows(rows, format);
    
    // Load custom user rules before categorizing
    const userRules = await loadUserRules(userId);
    const enrichedRows = categorizeAll(normalizedRows, userRules);

    const expenseDocs = enrichedRows.map(row => ({
      createdBy: userId,
      amount: row.amount,
      merchant: row.merchant,
      category: row.category,
      note: row.note,
      date: row.date,
      paymentMethod: row.paymentMethod,
      source: 'csv',
      isUncategorized: row.isUncategorized
    }));

    let insertedDocs = [];
    if (expenseDocs.length > 0) {
      // ordered: false allows insertion to continue even if some documents fail validation
      insertedDocs = await Expense.insertMany(expenseDocs, { ordered: false }).catch(err => {
        // Mongoose throws an error for unordered inserts if any fail, but err.insertedDocs contains the successful ones
        if (err.insertedDocs) return err.insertedDocs;
        throw err;
      });
    }

    await UploadedStatement.findByIdAndUpdate(statementId, {
      status: 'completed',
      format,
      totalRows: rows.length,
      parsedRows: normalizedRows.length,
      skippedRows: rows.length - normalizedRows.length,
      expenses: insertedDocs.map(e => e._id)
    });

  } catch (error) {
    await UploadedStatement.findByIdAndUpdate(statementId, {
      status: 'failed',
      errorMessage: error.message || 'An error occurred during processing'
    });
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

export const uploadStatement = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  const statement = await UploadedStatement.create({
    userId: req.user._id,
    originalFileName: req.file.originalname,
    storedFileName: req.file.filename,
    filePath: req.file.path,
    fileSize: req.file.size,
    status: 'processing'
  });

  // Respond immediately before processing begins
  res.status(202).json(
    new ApiResponse(202, { statementId: statement._id, message: 'File uploaded, processing started' }, 'Upload received')
  );

  // Trigger background processing (do not await)
  processStatement(statement._id, req.file.path, req.user._id);
});

export const getUploadHistory = asyncHandler(async (req, res) => {
  const statements = await UploadedStatement.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).json(
    new ApiResponse(200, statements, 'Upload history fetched')
  );
});

export const getUploadStatus = asyncHandler(async (req, res) => {
  const statement = await UploadedStatement.findOne({ 
    _id: req.params.id, 
    userId: req.user._id 
  });

  if (!statement) {
    throw new ApiError(404, 'Statement not found');
  }

  res.status(200).json(
    new ApiResponse(200, statement, 'Statement status fetched')
  );
});

export const deleteUploadRecord = asyncHandler(async (req, res) => {
  const statement = await UploadedStatement.findOne({ 
    _id: req.params.id, 
    userId: req.user._id 
  });

  if (!statement) {
    throw new ApiError(404, 'Statement not found');
  }

  let deletedCount = 0;
  if (statement.expenses && statement.expenses.length > 0) {
    const result = await Expense.deleteMany({ _id: { $in: statement.expenses } });
    deletedCount = result.deletedCount;
  }

  await UploadedStatement.findByIdAndDelete(statement._id);

  res.status(200).json(
    new ApiResponse(200, { deleted: deletedCount }, 'Upload and its expenses deleted')
  );
});
