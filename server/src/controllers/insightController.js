import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import AIInsight from '../models/AIInsight.js';
import Expense from '../models/Expense.js';
import { generateInsight } from '../services/aiInsightService.js';

/**
 * Aggregates all expense data for a specific user during a given month/year.
 * This is the core data building block sent to the AI for analysis.
 * 
 * @param {ObjectId|string} userId - The user's database ID
 * @param {number} month - The month (1-12)
 * @param {number} year - The year (e.g., 2024)
 * @returns {Promise<Object>} Formatted object containing totals, category breakdowns, and top merchants
 */
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

/**
 * Handles individual AI insight requests (e.g., just 'savings' or just 'anomalies').
 * Checks cache first to avoid redundant AI calls, otherwise builds data and queries AI.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} type - Internal DB type identifier (e.g., 'monthly_summary')
 * @param {string} promptType - The prompt template key in aiInsightService
 */
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

const saveInsight = async (userId, type, month, year, data, expenseSnapshot) => {
  return AIInsight.findOneAndUpdate(
    { userId, type, month, year },
    {
      userId,
      type,
      month,
      year,
      data,
      expenseSnapshot,
      generatedAt: new Date(),
      cached: false
    },
    { upsert: true }
  );
};

/**
 * Orchestrates the generation of a complete AI analysis across all 4 main categories.
 * Tries to fulfill from cache first, then falls back to a single unified AI request
 * which generates everything at once for efficiency.
 * 
 * @param {ObjectId|string} userId - The user's ID
 * @param {string|number} month - The requested month
 * @param {string|number} year - The requested year
 * @returns {Promise<Object|null>} An object containing summary, savings, anomalies, and patterns, or null if no data
 */
const generateCompleteAnalysisData = async (userId, month, year) => {
  // 1. Check cache for all 4 types first
  const types = ['monthly_summary', 'savings', 'anomalies', 'patterns'];
  const cachedResults = await Promise.all(
    types.map(t => getCachedInsight(userId, t, parseInt(month), parseInt(year)))
  );

  const isFullyCached = cachedResults.every(c => c !== null);

  if (isFullyCached) {
    return {
      summary: cachedResults[0].data,
      savings: cachedResults[1].data,
      anomalies: cachedResults[2].data,
      patterns: cachedResults[3].data,
      cached: true,
      generatedAt: cachedResults[0].generatedAt
    };
  }

  // 2. Not fully cached, generate all at once
  const expenseData = await buildExpenseData(userId, parseInt(month), parseInt(year));
  
  if (!expenseData) {
    return null;
  }

  const allInsightsData = await generateInsight('allInsights', expenseData);

  // 3. Save each part to cache
  const savePromises = [];
  const pMonth = parseInt(month);
  const pYear = parseInt(year);
  
  if (allInsightsData.summary) savePromises.push(saveInsight(userId, 'monthly_summary', pMonth, pYear, allInsightsData.summary, expenseData));
  if (allInsightsData.savings) savePromises.push(saveInsight(userId, 'savings', pMonth, pYear, allInsightsData.savings, expenseData));
  if (allInsightsData.anomalies) savePromises.push(saveInsight(userId, 'anomalies', pMonth, pYear, allInsightsData.anomalies, expenseData));
  if (allInsightsData.patterns) savePromises.push(saveInsight(userId, 'patterns', pMonth, pYear, allInsightsData.patterns, expenseData));
  
  await Promise.all(savePromises);

  return {
    summary: allInsightsData.summary,
    savings: allInsightsData.savings,
    anomalies: allInsightsData.anomalies,
    patterns: allInsightsData.patterns,
    cached: false,
    generatedAt: new Date()
  };
};

export const getCompleteAnalysis = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const userId = req.user._id;

  if (!month || !year) {
    throw new ApiError(400, 'Month and year are required');
  }

  const data = await generateCompleteAnalysisData(userId, month, year);
  
  if (!data) {
    return res.status(200).json(new ApiResponse(200, null, 'No data available for this month'));
  }

  res.status(200).json(new ApiResponse(200, data, data.cached ? 'Analysis retrieved from cache' : 'Analysis generated successfully'));
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

export const refreshCompleteAnalysis = asyncHandler(async (req, res) => {
  const { month, year } = req.body;
  const userId = req.user._id;
  
  if (!month || !year) {
    throw new ApiError(400, 'Month and year are required');
  }

  // Delete all 4 from cache
  const types = ['monthly_summary', 'savings', 'anomalies', 'patterns'];
  await AIInsight.deleteMany({ userId, type: { $in: types }, month, year });

  const data = await generateCompleteAnalysisData(userId, month, year);
  
  if (!data) {
    return res.status(200).json(new ApiResponse(200, null, 'No data available for this month'));
  }

  res.status(200).json(new ApiResponse(200, data, 'Analysis refreshed successfully'));
});

export const getInsightHistory = asyncHandler(async (req, res) => {
  const insights = await AIInsight.find({ userId: req.user._id })
    .sort({ generatedAt: -1 })
    .limit(50)
    .select('type month year generatedAt cached -_id');
    
  res.json(new ApiResponse(200, insights, 'History fetched'));
});
