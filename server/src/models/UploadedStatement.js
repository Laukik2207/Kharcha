import mongoose from 'mongoose';

const uploadedStatementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    originalFileName: {
      type: String,
      required: true
    },
    storedFileName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    format: {
      type: String,
      enum: ['kharcha', 'hdfc', 'sbi', 'icici', 'upi', 'unknown'],
      default: 'unknown'
    },
    status: {
      type: String,
      enum: ['processing', 'completed', 'failed'],
      default: 'processing'
    },
    totalRows: {
      type: Number,
      default: 0
    },
    parsedRows: {
      type: Number,
      default: 0
    },
    skippedRows: {
      type: Number,
      default: 0
    },
    failedRows: {
      type: Number,
      default: 0
    },
    errorMessage: {
      type: String,
      default: ''
    },
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense'
      }
    ]
  },
  {
    timestamps: true
  }
);

const UploadedStatement = mongoose.model('UploadedStatement', uploadedStatementSchema);
export default UploadedStatement;
