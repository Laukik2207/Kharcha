import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    amount: {
      type: Number,
      required: [true, 'Please add an amount']
    },
    merchant: {
      type: String,
      required: [true, 'Please add a merchant']
    },
    category: {
      type: String,
      required: [true, 'Please add a category']
    },
    description: {
      type: String
    },
    date: {
      type: Date,
      required: [true, 'Please add a date']
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

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
