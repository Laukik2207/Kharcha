import mongoose from 'mongoose';

const categoryRuleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null // null indicates a global/system rule
    },
    category: {
      type: String,
      required: true,
      enum: ['Food', 'Shopping', 'Groceries', 'Petrol', 'Entertainment', 'Bills', 'Travel', 'Health', 'Others']
    },
    type: {
      type: String,
      enum: ['keyword', 'regex', 'exact'],
      default: 'keyword'
    },
    pattern: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    matchCount: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

categoryRuleSchema.index({ userId: 1, pattern: 1 });
categoryRuleSchema.index({ userId: 1, isActive: 1, priority: -1 });

const CategoryRule = mongoose.model('CategoryRule', categoryRuleSchema);
export default CategoryRule;
