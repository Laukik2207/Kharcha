import Expense from '../models/Expense.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getMonthlySummary = asyncHandler(async (req, res) => {
  const { year = new Date().getFullYear() } = req.query;
  const numYear = Number(year);

  const startOfYear = new Date(numYear, 0, 1);
  const endOfYear = new Date(numYear, 11, 31, 23, 59, 59, 999);

  const rawData = await Expense.aggregate([
    { 
      $match: { 
        createdBy: req.user._id, 
        date: { $gte: startOfYear, $lte: endOfYear } 
      } 
    },
    { 
      $group: { 
        _id: { $month: '$date' }, 
        totalAmount: { $sum: '$amount' }, 
        count: { $sum: 1 } 
      } 
    },
    { $sort: { _id: 1 } }
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const filledArray = Array.from({ length: 12 }, (_, i) => {
    const data = rawData.find(d => d._id === i + 1);
    return {
      month: monthNames[i],
      totalAmount: data ? data.totalAmount : 0,
      count: data ? data.count : 0
    };
  });

  const totalYearly = filledArray.reduce((acc, curr) => acc + curr.totalAmount, 0);

  res.json(new ApiResponse(200, { year: numYear, monthly: filledArray, totalYearly }, 'Monthly summary fetched'));
});

export const getCategorySummary = asyncHandler(async (req, res) => {
  const date = new Date();
  const { month = date.getMonth() + 1, year = date.getFullYear() } = req.query;
  
  const numMonth = Number(month);
  const numYear = Number(year);

  const startOfMonth = new Date(numYear, numMonth - 1, 1);
  const endOfMonth = new Date(numYear, numMonth, 0, 23, 59, 59, 999);

  const byCategory = await Expense.aggregate([
    { 
      $match: { 
        createdBy: req.user._id, 
        date: { $gte: startOfMonth, $lte: endOfMonth } 
      } 
    },
    { 
      $group: { 
        _id: '$category', 
        totalAmount: { $sum: '$amount' }, 
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' }
      } 
    },
    { $sort: { totalAmount: -1 } }
  ]);

  const grandTotal = byCategory.reduce((acc, curr) => acc + curr.totalAmount, 0);
  
  const formattedByCategory = byCategory.map(item => ({
    category: item._id,
    totalAmount: item.totalAmount,
    count: item.count,
    avgAmount: item.avgAmount,
    percentage: grandTotal > 0 ? Number(((item.totalAmount / grandTotal) * 100).toFixed(1)) : 0
  }));

  res.json(new ApiResponse(200, { 
    month: numMonth, 
    year: numYear, 
    byCategory: formattedByCategory, 
    grandTotal, 
    topCategory: formattedByCategory[0] || null 
  }, 'Category summary fetched'));
});

export const getYearlySummary = asyncHandler(async (req, res) => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;

  const currentYearStart = new Date(currentYear, 0, 1);
  const currentYearEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);
  
  const lastYearStart = new Date(currentYear - 1, 0, 1);
  const lastYearEnd = new Date(currentYear - 1, 11, 31, 23, 59, 59, 999);

  const currentMonthStart = new Date(currentYear, currentMonth - 1, 1);
  const currentMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
  
  let lastMonthStart, lastMonthEnd;
  if (currentMonth === 1) {
    lastMonthStart = new Date(currentYear - 1, 11, 1);
    lastMonthEnd = new Date(currentYear - 1, 12, 0, 23, 59, 59, 999);
  } else {
    lastMonthStart = new Date(currentYear, currentMonth - 2, 1);
    lastMonthEnd = new Date(currentYear, currentMonth - 1, 0, 23, 59, 59, 999);
  }

  const [currYearData, lastYearData, currMonthData, lastMonthData] = await Promise.all([
    Expense.aggregate([
      { $match: { createdBy: req.user._id, date: { $gte: currentYearStart, $lte: currentYearEnd } } },
      { $group: { _id: null, totalSpent: { $sum: '$amount' }, totalTransactions: { $sum: 1 } } }
    ]),
    Expense.aggregate([
      { $match: { createdBy: req.user._id, date: { $gte: lastYearStart, $lte: lastYearEnd } } },
      { $group: { _id: null, totalSpent: { $sum: '$amount' }, totalTransactions: { $sum: 1 } } }
    ]),
    Expense.aggregate([
      { $match: { createdBy: req.user._id, date: { $gte: currentMonthStart, $lte: currentMonthEnd } } },
      { $group: { _id: null, totalSpent: { $sum: '$amount' }, totalTransactions: { $sum: 1 } } }
    ]),
    Expense.aggregate([
      { $match: { createdBy: req.user._id, date: { $gte: lastMonthStart, $lte: lastMonthEnd } } },
      { $group: { _id: null, totalSpent: { $sum: '$amount' }, totalTransactions: { $sum: 1 } } }
    ])
  ]);

  const cyTotal = currYearData[0]?.totalSpent || 0;
  const cyCount = currYearData[0]?.totalTransactions || 0;
  const lyTotal = lastYearData[0]?.totalSpent || 0;
  
  const cmTotal = currMonthData[0]?.totalSpent || 0;
  const cmCount = currMonthData[0]?.totalTransactions || 0;
  const lmTotal = lastMonthData[0]?.totalSpent || 0;

  const yoyGrowth = lyTotal > 0 ? Number((((cyTotal - lyTotal) / lyTotal) * 100).toFixed(1)) : (cyTotal > 0 ? 100 : 0);
  const momGrowth = lmTotal > 0 ? Number((((cmTotal - lmTotal) / lmTotal) * 100).toFixed(1)) : (cmTotal > 0 ? 100 : 0);

  res.json(new ApiResponse(200, {
    currentYear: { total: cyTotal, transactions: cyCount },
    lastYear: { total: lyTotal },
    yoyGrowth,
    currentMonth: { total: cmTotal, transactions: cmCount },
    lastMonth: { total: lmTotal },
    momGrowth
  }, 'Yearly summary fetched'));
});

export const getDailyTrend = asyncHandler(async (req, res) => {
  const date = new Date();
  const { month = date.getMonth() + 1, year = date.getFullYear() } = req.query;
  
  const numMonth = Number(month);
  const numYear = Number(year);

  const startOfMonth = new Date(numYear, numMonth - 1, 1);
  const endOfMonth = new Date(numYear, numMonth, 0, 23, 59, 59, 999);
  const daysInMonth = endOfMonth.getDate();

  const rawData = await Expense.aggregate([
    { 
      $match: { 
        createdBy: req.user._id, 
        date: { $gte: startOfMonth, $lte: endOfMonth } 
      } 
    },
    { 
      $group: { 
        _id: { $dayOfMonth: '$date' }, 
        totalAmount: { $sum: '$amount' }, 
        count: { $sum: 1 } 
      } 
    },
    { $sort: { _id: 1 } }
  ]);

  const dailyTrend = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const data = rawData.find(d => d._id === day);
    return {
      day,
      totalAmount: data ? data.totalAmount : 0,
      count: data ? data.count : 0
    };
  });

  res.json(new ApiResponse(200, { dailyTrend, month: numMonth, year: numYear }, 'Daily trend fetched'));
});

export const getTopMerchants = asyncHandler(async (req, res) => {
  const { month, year, limit = 5 } = req.query;
  const matchStage = { createdBy: req.user._id };

  if (month && year) {
    const numMonth = Number(month);
    const numYear = Number(year);
    matchStage.date = {
      $gte: new Date(numYear, numMonth - 1, 1),
      $lte: new Date(numYear, numMonth, 0, 23, 59, 59, 999)
    };
  }

  const topMerchants = await Expense.aggregate([
    { $match: matchStage },
    { 
      $group: { 
        _id: '$merchant', 
        totalAmount: { $sum: '$amount' }, 
        count: { $sum: 1 } 
      } 
    },
    { $sort: { totalAmount: -1 } },
    { $limit: Number(limit) },
    { $project: { merchant: '$_id', totalAmount: 1, count: 1, _id: 0 } }
  ]);

  res.json(new ApiResponse(200, { topMerchants }, 'Top merchants fetched'));
});

export const getPaymentMethodBreakdown = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  const matchStage = { createdBy: req.user._id };

  if (month && year) {
    const numMonth = Number(month);
    const numYear = Number(year);
    matchStage.date = {
      $gte: new Date(numYear, numMonth - 1, 1),
      $lte: new Date(numYear, numMonth, 0, 23, 59, 59, 999)
    };
  }

  const byPaymentMethodRaw = await Expense.aggregate([
    { $match: matchStage },
    { 
      $group: { 
        _id: '$paymentMethod', 
        totalAmount: { $sum: '$amount' }, 
        count: { $sum: 1 } 
      } 
    },
    { $sort: { totalAmount: -1 } }
  ]);

  const grandTotal = byPaymentMethodRaw.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const byPaymentMethod = byPaymentMethodRaw.map(item => ({
    paymentMethod: item._id,
    totalAmount: item.totalAmount,
    count: item.count,
    percentage: grandTotal > 0 ? Number(((item.totalAmount / grandTotal) * 100).toFixed(1)) : 0
  }));

  res.json(new ApiResponse(200, { byPaymentMethod, grandTotal }, 'Payment breakdown fetched'));
});
