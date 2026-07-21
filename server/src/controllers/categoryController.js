import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import Category from '../models/Category.js';
import CategoryRule from '../models/CategoryRule.js';
import Expense from '../models/Expense.js';
import { SYSTEM_RULES, loadUserRules, testRule, categorize } from '../services/categorizationService.js';

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(new ApiResponse(200, categories, 'Categories fetched'));
});

export const getUserRules = asyncHandler(async (req, res) => {
  const rules = await CategoryRule.find({ userId: req.user._id })
    .sort({ priority: -1, createdAt: -1 });
  res.status(200).json(new ApiResponse(200, rules, 'Rules fetched'));
});

export const getSystemRules = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, { rules: SYSTEM_RULES, total: SYSTEM_RULES.length }, 'System rules fetched')
  );
});

export const createRule = asyncHandler(async (req, res) => {
  const { category, type, pattern, description, priority = 10 } = req.body;

  if (!category || !type || !pattern) {
    throw new ApiError(400, 'Category, type, and pattern are required');
  }

  if (type === 'regex') {
    try {
      new RegExp(pattern);
    } catch (err) {
      throw new ApiError(400, 'Invalid regex pattern');
    }
  }

  const existingRule = await CategoryRule.findOne({
    userId: req.user._id,
    type,
    pattern: pattern.trim()
  });

  if (existingRule) {
    throw new ApiError(409, 'A rule with this pattern already exists');
  }

  const rule = await CategoryRule.create({
    userId: req.user._id,
    category,
    type,
    pattern: pattern.trim(),
    description,
    priority
  });

  res.status(201).json(new ApiResponse(201, rule, 'Rule created'));
});

export const updateRule = asyncHandler(async (req, res) => {
  const { category, type, pattern, description, isActive, priority } = req.body;

  const rule = await CategoryRule.findOne({ _id: req.params.id, userId: req.user._id });
  
  if (!rule) {
    throw new ApiError(404, 'Rule not found');
  }

  if (type === 'regex' && pattern) {
    try {
      new RegExp(pattern);
    } catch (err) {
      throw new ApiError(400, 'Invalid regex pattern');
    }
  }

  if (pattern && pattern.trim() !== rule.pattern) {
    const existingRule = await CategoryRule.findOne({
      userId: req.user._id,
      type: type || rule.type,
      pattern: pattern.trim()
    });

    if (existingRule && existingRule._id.toString() !== rule._id.toString()) {
      throw new ApiError(409, 'A rule with this pattern already exists');
    }
  }

  if (category) rule.category = category;
  if (type) rule.type = type;
  if (pattern) rule.pattern = pattern.trim();
  if (description !== undefined) rule.description = description;
  if (isActive !== undefined) rule.isActive = isActive;
  if (priority !== undefined) rule.priority = priority;

  await rule.save();

  res.status(200).json(new ApiResponse(200, rule, 'Rule updated'));
});

export const deleteRule = asyncHandler(async (req, res) => {
  const rule = await CategoryRule.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  
  if (!rule) {
    throw new ApiError(404, 'Rule not found');
  }

  res.status(200).json(new ApiResponse(200, { id: req.params.id }, 'Rule deleted'));
});

export const testRulePreview = asyncHandler(async (req, res) => {
  const { pattern, type, merchants } = req.body;

  if (!pattern || !type || !Array.isArray(merchants)) {
    throw new ApiError(400, 'Pattern, type, and merchants array are required');
  }

  if (type === 'regex') {
    try {
      new RegExp(pattern);
    } catch (err) {
      throw new ApiError(400, 'Invalid regex pattern');
    }
  }

  const results = testRule(pattern, type, merchants);
  
  res.status(200).json(new ApiResponse(200, { results }, 'Test complete'));
});

export const recategorizeExpenses = asyncHandler(async (req, res) => {
  const userRules = await loadUserRules(req.user._id);
  
  const expenses = await Expense.find({ createdBy: req.user._id });
  let changedCount = 0;
  
  const updates = expenses.map(expense => {
    const { category: newCategory, matched } = categorize(expense.merchant, userRules);

    if (newCategory !== expense.category) {
      changedCount++;
      return Expense.findByIdAndUpdate(expense._id, { category: newCategory, isUncategorized: !matched });
    }
    return null;
  }).filter(Boolean);

  await Promise.all(updates);

  res.status(200).json(new ApiResponse(200, { updated: changedCount, total: expenses.length }, 'Recategorization complete'));
});
