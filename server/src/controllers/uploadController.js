import fs from 'fs';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import UploadedStatement from '../models/UploadedStatement.js';
import Expense from '../models/Expense.js';
import { parseCSVFile, parseCSVFromBuffer, detectCSVFormat, normalizeRows } from '../services/csvParserService.js';
import { categorizeAll, loadUserRules } from '../services/categorizationService.js';
import { uploadFileToS3, deleteFileFromS3, getSignedDownloadUrl } from '../services/s3Service.js';

export const processStatement = async (statementId, fileBuffer, userId) => {
  try {
    const rows = await parseCSVFromBuffer(fileBuffer);
    
    if (rows.length === 0) {
      await UploadedStatement.findByIdAndUpdate(statementId, {
        status: 'failed',
        errorMessage: 'CSV file is empty or has no data rows'
      });
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
  }
};

export const uploadStatement = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file uploaded');
  }

  let s3Result;
  try {
    s3Result = await uploadFileToS3(req.file.buffer, req.file.originalname, req.user._id, req.file.mimetype);
  } catch (err) {
    throw new ApiError(500, 'Failed to store file securely. Please try again.');
  }

  const statement = await UploadedStatement.create({
    userId: req.user._id,
    originalFileName: req.file.originalname,
    storedFileName: s3Result.key,
    filePath: s3Result.location,
    s3Key: s3Result.key,
    fileSize: req.file.size,
    status: 'processing'
  });

  // Respond immediately before processing begins
  res.status(202).json(
    new ApiResponse(202, { statementId: statement._id, message: 'File uploaded, processing started' }, 'Upload received')
  );

  // Trigger background processing (do not await)
  processStatement(statement._id, req.file.buffer, req.user._id);
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

  if (statement.s3Key) {
    try {
      await deleteFileFromS3(statement.s3Key);
    } catch (err) {
      console.error('S3 delete failed for key:', statement.s3Key, err.message);
    }
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

export const getSignedUrl = asyncHandler(async (req, res) => {
  const statement = await UploadedStatement.findOne({ 
    _id: req.params.id, 
    userId: req.user._id 
  });

  if (!statement) {
    throw new ApiError(404, 'Statement not found');
  }

  if (!statement.s3Key) {
    throw new ApiError(400, 'No S3 file associated with this statement');
  }

  try {
    const url = await getSignedDownloadUrl(statement.s3Key);
    res.status(200).json(
      new ApiResponse(200, { url, expiresIn: 3600 }, 'Signed URL generated')
    );
  } catch (err) {
    throw new ApiError(500, 'Could not generate download link. Please try again.');
  }
});
