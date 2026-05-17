import mongoose from 'mongoose';

const uploadedStatementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'processed', 'failed'],
      default: 'pending'
    },
    transactionCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const UploadedStatement = mongoose.model('UploadedStatement', uploadedStatementSchema);
export default UploadedStatement;
