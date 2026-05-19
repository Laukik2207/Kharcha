import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    category: {
      type: String,
      required: true,
      enum: ['Food', 'Shopping', 'Groceries', 'Petrol', 'Entertainment', 'Bills', 'Travel', 'Health', 'Others'],
      default: 'Others'
    },
    merchant: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100
    },
    note: {
      type: String,
      trim: true,
      maxLength: 500,
      default: ''
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Card', 'Cash', 'Net Banking', 'Other'],
      default: 'UPI'
    },
    source: {
      type: String,
      enum: ['manual', 'csv'],
      default: 'manual'
    }
  },
  {
    timestamps: true
  }
);

expenseSchema.index({ createdBy: 1, date: -1 });

expenseSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.__v;
    return ret;
  }
});

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
