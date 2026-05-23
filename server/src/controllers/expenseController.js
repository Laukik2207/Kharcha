import mongoose from 'mongoose';
import Expense from '../models/Expense.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const getExpenses = asyncHandler(async (req, res) => {
  const { 
    category, 
    paymentMethod, 
    source, 
    search, 
    startDate, 
    endDate, 
    minAmount, 
    maxAmount,
    sortBy = 'date',
    sortOrder = 'desc',
    page = 1,
    limit = 20
  } = req.query;

  const query = { createdBy: req.user._id };

  if (category) query.category = category;
  if (paymentMethod) query.paymentMethod = paymentMethod;
  if (source) query.source = source;
  if (search) query.merchant = { $regex: search, $options: 'i' };
  
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  if (minAmount || maxAmount) {
    query.amount = {};
    if (minAmount) query.amount.$gte = Number(minAmount);
    if (maxAmount) query.amount.$lte = Number(maxAmount);
  }

  const allowedSorts = ['date', 'amount', 'merchant', 'category'];
  const sortField = allowedSorts.includes(sortBy) ? sortBy : 'date';
  const sortDir = sortOrder === 'asc' ? 1 : -1;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const expenses = await Expense.find(query)
    .sort({ [sortField]: sortDir })
    .skip(skip)
    .limit(limitNum);

  const totalCount = await Expense.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limitNum);

  res.json(new ApiResponse(200, { expenses, totalCount, totalPages, currentPage: pageNum }, 'Expenses fetched'));
});

export const getExpenseById = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, createdBy: req.user._id });
  
  if (!expense) {
    throw new ApiError(404, 'Expense not found');
  }

  res.json(new ApiResponse(200, expense, 'Expense fetched'));
});

export const createExpense = asyncHandler(async (req, res) => {
  const { amount, category, merchant, note, date, paymentMethod } = req.body;

  if (amount === undefined || amount <= 0) {
    throw new ApiError(400, 'Amount must be greater than 0');
  }
  if (!merchant || !merchant.trim()) {
    throw new ApiError(400, 'Merchant is required');
  }
  
  const validCategories = ['Food', 'Shopping', 'Groceries', 'Petrol', 'Entertainment', 'Bills', 'Travel', 'Health', 'Others'];
  if (category && !validCategories.includes(category)) {
    throw new ApiError(400, 'Invalid category');
  }

  const validMethods = ['UPI', 'Card', 'Cash', 'Net Banking', 'Other'];
  if (paymentMethod && !validMethods.includes(paymentMethod)) {
    throw new ApiError(400, 'Invalid payment method');
  }

  const expense = await Expense.create({
    amount,
    category,
    merchant,
    note,
    date,
    paymentMethod,
    createdBy: req.user._id,
    source: 'manual',
    isUncategorized: false
  });

  res.status(201).json(new ApiResponse(201, expense, 'Expense added successfully'));
});

export const updateExpense = asyncHandler(async (req, res) => {
  const { amount, category, merchant, note, date, paymentMethod } = req.body;

  if (amount !== undefined && amount <= 0) {
    throw new ApiError(400, 'Amount must be greater than 0');
  }
  if (merchant !== undefined && !merchant.trim()) {
    throw new ApiError(400, 'Merchant cannot be empty');
  }

  const validCategories = ['Food', 'Shopping', 'Groceries', 'Petrol', 'Entertainment', 'Bills', 'Travel', 'Health', 'Others'];
  if (category && !validCategories.includes(category)) {
    throw new ApiError(400, 'Invalid category');
  }

  const validMethods = ['UPI', 'Card', 'Cash', 'Net Banking', 'Other'];
  if (paymentMethod && !validMethods.includes(paymentMethod)) {
    throw new ApiError(400, 'Invalid payment method');
  }

  const updated = await Expense.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    { amount, category, merchant, note, date, paymentMethod, isUncategorized: false },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new ApiError(404, 'Expense not found');
  }

  res.json(new ApiResponse(200, updated, 'Expense updated successfully'));
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const deleted = await Expense.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
  
  if (!deleted) {
    throw new ApiError(404, 'Expense not found');
  }

  res.json(new ApiResponse(200, { id: req.params.id }, 'Expense deleted successfully'));
});

export const getExpenseSummary = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const matchStage = { createdBy: req.user._id };

  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);
    matchStage.date = { $gte: start, $lte: end };
  }

  const [byCategory, totalResult] = await Promise.all([
    Expense.aggregate([
      { $match: matchStage },
      { $group: { _id: '$category', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { totalAmount: -1 } }
    ]),
    Expense.aggregate([
      { $match: matchStage },
      { $group: { _id: null, totalSpent: { $sum: '$amount' } } }
    ])
  ]);

  const totalSpent = totalResult.length > 0 ? totalResult[0].totalSpent : 0;

  res.json(new ApiResponse(200, { 
    byCategory: byCategory.map(item => ({ category: item._id, totalAmount: item.totalAmount, count: item.count })), 
    totalSpent, 
    month: month || null, 
    year: year || null 
  }, 'Summary fetched'));
});
