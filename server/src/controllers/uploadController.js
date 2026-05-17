import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { parseCSV } from '../services/csvParserService.js';

export const uploadStatement = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload a CSV file');
  }

  // TODO: Process the CSV file, save records, etc.
  const records = await parseCSV(req.file.path);

  res.status(200).json(
    new ApiResponse(200, {
      file: req.file.filename,
      count: records.length
    }, 'File uploaded successfully')
  );
});
