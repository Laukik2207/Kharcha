import Expense from '../models/Expense.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const getExpenses = asyncHandler(async (req, res) => {
  const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 });
  res.json(new ApiResponse(200, expenses, 'Expenses fetched successfully'));
});

export const createExpense = asyncHandler(async (req, res) => {
  const { amount, merchant, category, description, date } = req.body;

  const expense = await Expense.create({
    userId: req.user._id,
    amount,
    merchant,
    category,
    description,
    date,
    source: 'manual'
  });

  res.status(201).json(new ApiResponse(201, expense, 'Expense created successfully'));
});

export const updateExpense = asyncHandler(async (req, res) => {
  let expense = await Expense.findById(req.params.id);

  if (!expense) {
    throw new ApiError(404, 'Expense not found');
  }

  if (expense.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'User not authorized to update this expense');
  }

  expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json(new ApiResponse(200, expense, 'Expense updated successfully'));
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    throw new ApiError(404, 'Expense not found');
  }

  if (expense.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'User not authorized to delete this expense');
  }

  await expense.deleteOne();

  res.json(new ApiResponse(200, {}, 'Expense removed successfully'));
});
