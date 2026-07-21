import Expense from '../models/Expense.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

const buildDateMatchStage = (userId, yearsStr, monthsStr) => {
  const match = { createdBy: userId };
  
  if (yearsStr || monthsStr) {
    match.$expr = { $and: [] };
    if (yearsStr) {
      const years = yearsStr.split(',').map(Number);
      match.$expr.$and.push({ $in: [{ $year: "$date" }, years] });
    }
    if (monthsStr) {
      const months = monthsStr.split(',').map(Number);
      match.$expr.$and.push({ $in: [{ $month: "$date" }, months] });
    }
    if (match.$expr.$and.length === 0) {
      delete match.$expr;
    }
  }
  return match;
};

export const getAvailableDates = asyncHandler(async (req, res) => {
  const dates = await Expense.aggregate([
    { $match: { createdBy: req.user._id } },
    { $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } }
  ]);

  const yearsMap = {};
  dates.forEach(d => {
    if (!d._id.year || !d._id.month) return;
    if (!yearsMap[d._id.year]) {
      yearsMap[d._id.year] = [];
    }
    yearsMap[d._id.year].push(d._id.month);
  });

  const availableDates = Object.keys(yearsMap).map(year => ({
    year: Number(year),
    months: yearsMap[year].sort((a, b) => a - b)
  })).sort((a, b) => b.year - a.year);

  res.json(new ApiResponse(200, availableDates, 'Available dates fetched'));
});

export const getMonthlySummary = asyncHandler(async (req, res) => {
  const { years, months } = req.query;
  const matchStage = buildDateMatchStage(req.user._id, years, months);

  const rawData = await Expense.aggregate([
    { $match: matchStage },
    { 
      $group: { 
        _id: { year: { $year: '$date' }, month: { $month: '$date' } }, 
        totalAmount: { $sum: '$amount' }, 
        count: { $sum: 1 } 
      } 
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Create continuous timeline
  const filledArray = rawData.map(d => ({
    month: `${monthNames[d._id.month - 1]} ${d._id.year}`,
    rawYear: d._id.year,
    rawMonth: d._id.month,
    totalAmount: d.totalAmount,
    count: d.count
  }));

  const totalYearly = filledArray.reduce((acc, curr) => acc + curr.totalAmount, 0);

  res.json(new ApiResponse(200, { monthly: filledArray, totalYearly }, 'Monthly summary fetched'));
});

export const getCategorySummary = asyncHandler(async (req, res) => {
  const { years, months } = req.query;
  const matchStage = buildDateMatchStage(req.user._id, years, months);

  const byCategory = await Expense.aggregate([
    { $match: matchStage },
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
    byCategory: formattedByCategory, 
    grandTotal, 
    topCategory: formattedByCategory[0] || null 
  }, 'Category summary fetched'));
});

export const getYearlySummary = asyncHandler(async (req, res) => {
  const { years, months } = req.query;
  const userId = req.user._id;

  const sumStage = { $group: { _id: null, total: { $sum: '$amount' }, transactions: { $sum: 1 } } };
  const readTotals = (rows) => ({ total: rows[0]?.total || 0, transactions: rows[0]?.transactions || 0 });

  // "This month" = the current selection (year + month filters applied)
  const monthMatch = buildDateMatchStage(userId, years, months);

  // Determine the primary selected year for the year-over-year comparison
  const yearList = years ? years.split(',').map(Number).filter(Boolean) : [];
  const primaryYear = yearList.length > 0 ? Math.max(...yearList) : new Date().getFullYear();

  const yearMatch = (y) => ({ createdBy: userId, $expr: { $eq: [{ $year: '$date' }, y] } });

  const [monthRows, yearRows, lastYearRows] = await Promise.all([
    Expense.aggregate([{ $match: monthMatch }, sumStage]),
    Expense.aggregate([{ $match: yearMatch(primaryYear) }, sumStage]),
    Expense.aggregate([{ $match: yearMatch(primaryYear - 1) }, sumStage])
  ]);

  const currentMonth = readTotals(monthRows);
  const currentYear = readTotals(yearRows);
  const lastYear = readTotals(lastYearRows);

  const yoyGrowth = lastYear.total > 0
    ? Number((((currentYear.total - lastYear.total) / lastYear.total) * 100).toFixed(1))
    : 0;

  res.json(new ApiResponse(200, {
    currentYear,
    currentMonth,
    lastYear,
    yoyGrowth
  }, 'Summary fetched'));
});

export const getDailyTrend = asyncHandler(async (req, res) => {
  const { years, months } = req.query;
  const matchStage = buildDateMatchStage(req.user._id, years, months);

  const rawData = await Expense.aggregate([
    { $match: matchStage },
    { 
      $group: { 
        _id: { 
          year: { $year: '$date' },
          month: { $month: '$date' },
          day: { $dayOfMonth: '$date' } 
        }, 
        totalAmount: { $sum: '$amount' }, 
        count: { $sum: 1 } 
      } 
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);

  if (rawData.length === 0) {
    return res.json(new ApiResponse(200, { dailyTrend: [] }, 'Daily trend fetched'));
  }

  // Create continuous timeline between first and last date
  const first = rawData[0]._id;
  const last = rawData[rawData.length - 1]._id;
  
  const startDate = new Date(first.year, first.month - 1, first.day);
  const endDate = new Date(last.year, last.month - 1, last.day);
  
  const dailyTrend = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    
    const data = rawData.find(item => item._id.year === y && item._id.month === m && item._id.day === day);
    
    dailyTrend.push({
      dateStr: `${day} ${monthNames[m - 1]}`,
      day: day,
      month: m,
      year: y,
      totalAmount: data ? data.totalAmount : 0,
      count: data ? data.count : 0
    });
  }

  res.json(new ApiResponse(200, { dailyTrend }, 'Daily trend fetched'));
});

export const getTopMerchants = asyncHandler(async (req, res) => {
  const { years, months, limit = 5 } = req.query;
  const matchStage = buildDateMatchStage(req.user._id, years, months);

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
  const { years, months } = req.query;
  const matchStage = buildDateMatchStage(req.user._id, years, months);

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
