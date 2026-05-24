import mongoose from 'mongoose';

const aiInsightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    type: {
      type: String,
      enum: ['monthly_summary', 'savings', 'anomalies', 'patterns', 'budget'],
      required: true
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    year: {
      type: Number,
      required: true
    },
    data: {
      type: mongoose.Schema.Types.Mixed
    },
    expenseSnapshot: {
      type: mongoose.Schema.Types.Mixed
    },
    tokensUsed: {
      type: Number,
      default: 0
    },
    cached: {
      type: Boolean,
      default: false
    },
    generatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

aiInsightSchema.index({ userId: 1, type: 1, month: 1, year: 1 });

const AIInsight = mongoose.model('AIInsight', aiInsightSchema);
export default AIInsight;
