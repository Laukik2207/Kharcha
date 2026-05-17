import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

export const syncUser = asyncHandler(async (req, res) => {
  // protect middleware already upserts the user
  res.json(new ApiResponse(200, req.user, 'User synced successfully'));
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, req.user, 'User fetched successfully'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;
  
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name },
    { new: true, runValidators: true }
  );

  res.json(new ApiResponse(200, updatedUser, 'Profile updated'));
});
