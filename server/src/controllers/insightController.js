import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import AIInsight from '../models/AIInsight.js';
import Expense from '../models/Expense.js';
import { generateInsight } from '../services/geminiService.js';

const buildExpenseData = async (userId, month, year) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  
  const prevMonthStart = new Date(year, month - 2, 1);
  const prevMonthEnd = new Date(year, month - 1, 0, 23, 59, 59, 999);

  const matchStage = { createdBy: userId, date: { $gte: start, $lte: end } };

  const [
    byCategory,
    totalResult,
    prevTotalResult,
    topMerchants,
    paymentMethods,
    transactionCount
  ] = await Promise.all([
    Expense.aggregate([
      { $match: matchStage },
      { $group: { _id: '$category', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { totalAmount: -1 } },
      { $project: { category: '$_id', totalAmount: 1, count: 1, _id: 0 } }
    ]),
    Expense.aggregate([
      { $match: matchStage },
      { $group: { _id: null, totalSpent: { $sum: '$amount' } } }
    ]),
    Expense.aggregate([
      { $match: { createdBy: userId, date: { $gte: prevMonthStart, $lte: prevMonthEnd } } },
      { $group: { _id: null, totalSpent: { $sum: '$amount' } } }
    ]),
    Expense.aggregate([
      { $match: matchStage },
      { $group: { _id: '$merchant', totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { totalAmount: -1 } },
      { $limit: 5 }
    ]),
    Expense.aggregate([
      { $match: matchStage },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    Expense.countDocuments(matchStage)
  ]);

  const totalSpent = totalResult.length > 0 ? totalResult[0].totalSpent : 0;
  const previousMonthTotal = prevTotalResult.length > 0 ? prevTotalResult[0].totalSpent : 0;
  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyAverage = totalSpent / daysInMonth;

  return {
    month,
    year,
    totalSpent,
    byCategory,
    topCategory: byCategory.length > 0 ? byCategory[0] : null,
    transactionCount,
    dailyAverage,
    previousMonthTotal,
    topMerchants,
    paymentMethods
  };
};

const getCachedInsight = async (userId, type, month, year) => {
  const insight = await AIInsight.findOne({ userId, type, month, year });
  if (insight) {
    const hoursSinceGeneration = (Date.now() - insight.generatedAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceGeneration < 24) {
      return { ...insight.toObject(), cached: true };
    }
  }
  return null;
};

const handleInsightRequest = async (req, res, type, promptType) => {
  const month = parseInt(req.query.month) || new Date().getMonth() + 1;
  const year = parseInt(req.query.year) || new Date().getFullYear();

  const cached = await getCachedInsight(req.user._id, type, month, year);
  if (cached) {
    return res.json(new ApiResponse(200, { ...cached.data, cached: true, generatedAt: cached.generatedAt }, 'Insight fetched from cache'));
  }

  const expenseData = await buildExpenseData(req.user._id, month, year);
  if (expenseData.totalSpent === 0) {
    return res.json(new ApiResponse(200, { empty: true, message: 'No expenses found for this period' }, 'No data'));
  }

  const result = await generateInsight(promptType, expenseData);

  await AIInsight.findOneAndUpdate(
    { userId: req.user._id, type, month, year },
    {
      userId: req.user._id,
      type,
      month,
      year,
      data: result,
      expenseSnapshot: expenseData,
      generatedAt: new Date(),
      cached: false
    },
    { upsert: true }
  );

  res.json(new ApiResponse(200, { ...result, cached: false, generatedAt: new Date() }, 'Insight generated'));
};

export const getMonthlySummary = asyncHandler(async (req, res) => {
  await handleInsightRequest(req, res, 'monthly_summary', 'monthlySummary');
});

export const getSavingsRecommendations = asyncHandler(async (req, res) => {
  await handleInsightRequest(req, res, 'savings', 'savingsRecommendations');
});

export const getAnomalyDetection = asyncHandler(async (req, res) => {
  await handleInsightRequest(req, res, 'anomalies', 'unusualSpending');
});

export const getSpendingPatterns = asyncHandler(async (req, res) => {
  await handleInsightRequest(req, res, 'patterns', 'weeklyPattern');
});

export const getBudgetAdvice = asyncHandler(async (req, res) => {
  const { budgetGoal, month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.body;
  if (!budgetGoal) throw new ApiError(400, 'Budget goal is required');

  const expenseData = await buildExpenseData(req.user._id, parseInt(month), parseInt(year));
  if (expenseData.totalSpent === 0) {
    return res.json(new ApiResponse(200, { empty: true, message: 'No expenses found for this period' }, 'No data'));
  }

  const result = await generateInsight('budgetAdvice', expenseData, { budgetGoal });
  
  await AIInsight.findOneAndUpdate(
    { userId: req.user._id, type: 'budget', month, year },
    {
      userId: req.user._id,
      type: 'budget',
      month,
      year,
      data: result,
      expenseSnapshot: expenseData,
      generatedAt: new Date(),
      cached: false
    },
    { upsert: true }
  );

  res.json(new ApiResponse(200, { ...result, cached: false, generatedAt: new Date() }, 'Insight generated'));
});

export const refreshInsight = asyncHandler(async (req, res) => {
  const { type, month, year } = req.body;
  
  if (!type || !month || !year) {
    throw new ApiError(400, 'Type, month, and year are required');
  }

  await AIInsight.deleteOne({ userId: req.user._id, type, month, year });

  const reqMock = { query: { month, year }, user: req.user };
  
  // Create a mock response to capture the generated result
  let responseData = null;
  const resMock = {
    json: (response) => { responseData = response; return response; }
  };

  const promptTypeMap = {
    'monthly_summary': 'monthlySummary',
    'savings': 'savingsRecommendations',
    'anomalies': 'unusualSpending',
    'patterns': 'weeklyPattern'
  };

  if (!promptTypeMap[type]) {
    throw new ApiError(400, 'Invalid insight type');
  }

  await handleInsightRequest(reqMock, resMock, type, promptTypeMap[type]);
  res.json(responseData);
});

export const getInsightHistory = asyncHandler(async (req, res) => {
  const insights = await AIInsight.find({ userId: req.user._id })
    .sort({ generatedAt: -1 })
    .limit(50)
    .select('type month year generatedAt cached -_id');
    
  res.json(new ApiResponse(200, insights, 'History fetched'));
});
