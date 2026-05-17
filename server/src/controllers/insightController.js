import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import AIInsight from '../models/AIInsight.js';

export const getInsights = asyncHandler(async (req, res) => {
  const insights = await AIInsight.find({ userId: req.user._id }).sort({ generatedAt: -1 });
  
  res.json(new ApiResponse(200, insights, 'Insights fetched successfully'));
});
