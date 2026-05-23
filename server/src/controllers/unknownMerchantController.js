import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Expense from '../models/Expense.js';
import CategoryRule from '../models/CategoryRule.js';

export const getUnknownMerchants = asyncHandler(async (req, res) => {
  const unknownMerchants = await Expense.aggregate([
    { $match: { createdBy: req.user._id, isUncategorized: true } },
    { 
      $group: {
        _id: '$merchant',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        lastSeen: { $max: '$date' },
        firstSeen: { $min: '$date' },
        expenseIds: { $push: '$_id' },
        paymentMethods: { $addToSet: '$paymentMethod' },
        sampleNote: { $first: '$note' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.json(new ApiResponse(200, { unknownMerchants, totalCount: unknownMerchants.length }, 'Unknown merchants fetched'));
});

export const assignCategory = asyncHandler(async (req, res) => {
  const { merchant, category, createRule = true, ruleType = 'keyword' } = req.body;

  if (!merchant) throw new ApiError(400, 'Merchant is required');
  
  const validCategories = ['Food', 'Shopping', 'Groceries', 'Petrol', 'Entertainment', 'Bills', 'Travel', 'Health', 'Others'];
  if (!validCategories.includes(category)) throw new ApiError(400, 'Invalid category');

  // Update existing expenses
  const updateResult = await Expense.updateMany(
    { createdBy: req.user._id, merchant, isUncategorized: true },
    { category, isUncategorized: false }
  );

  let ruleCreated = false;
  if (createRule) {
    const pattern = ruleType === 'keyword' ? merchant.toLowerCase().trim() : merchant.trim();
    
    await CategoryRule.findOneAndUpdate(
      { userId: req.user._id, pattern, type: ruleType },
      {
        userId: req.user._id,
        category,
        type: ruleType,
        pattern,
        priority: 10,
        isActive: true,
        description: `Auto-created from unknown merchant review: "${merchant}"`
      },
      { upsert: true, new: true, runValidators: true }
    );
    ruleCreated = true;
  }

  res.json(new ApiResponse(200, { updatedExpenses: updateResult.modifiedCount, ruleCreated }, 'Category assigned successfully'));
});

export const assignCategoryBulk = asyncHandler(async (req, res) => {
  const { assignments } = req.body;

  if (!Array.isArray(assignments) || assignments.length === 0) {
    throw new ApiError(400, 'Assignments array is required');
  }

  const validCategories = ['Food', 'Shopping', 'Groceries', 'Petrol', 'Entertainment', 'Bills', 'Travel', 'Health', 'Others'];

  const results = await Promise.allSettled(assignments.map(async (assignment) => {
    const { merchant, category, createRule = true, ruleType = 'keyword' } = assignment;
    
    if (!merchant || !validCategories.includes(category)) {
      throw new Error(`Invalid data for merchant: ${merchant}`);
    }

    const updateResult = await Expense.updateMany(
      { createdBy: req.user._id, merchant, isUncategorized: true },
      { category, isUncategorized: false }
    );

    if (createRule) {
      const pattern = ruleType === 'keyword' ? merchant.toLowerCase().trim() : merchant.trim();
      await CategoryRule.findOneAndUpdate(
        { userId: req.user._id, pattern, type: ruleType },
        {
          userId: req.user._id,
          category,
          type: ruleType,
          pattern,
          priority: 10,
          isActive: true,
          description: `Auto-created from unknown merchant review: "${merchant}"`
        },
        { upsert: true }
      );
    }
    
    return updateResult.modifiedCount;
  }));

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  res.json(new ApiResponse(200, { successful, failed, total: assignments.length }, 'Bulk assignment complete'));
});

export const dismissMerchant = asyncHandler(async (req, res) => {
  const { merchant } = req.body;
  if (!merchant) throw new ApiError(400, 'Merchant is required');

  await Expense.updateMany(
    { createdBy: req.user._id, merchant, isUncategorized: true },
    { category: 'Others', isUncategorized: false }
  );

  await CategoryRule.findOneAndUpdate(
    { userId: req.user._id, pattern: merchant.trim(), type: 'exact' },
    {
      userId: req.user._id,
      category: 'Others',
      type: 'exact',
      pattern: merchant.trim(),
      priority: 10,
      isActive: true,
      description: `Dismissed from unknown merchant review`
    },
    { upsert: true }
  );

  res.json(new ApiResponse(200, { dismissed: true }, 'Merchant dismissed'));
});

export const getUnknownCount = asyncHandler(async (req, res) => {
  const count = await Expense.countDocuments({ createdBy: req.user._id, isUncategorized: true });
  res.json(new ApiResponse(200, { count }, 'Count fetched'));
});
