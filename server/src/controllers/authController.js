import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(409, 'Email already registered');
  }

  const user = await User.create({
    name,
    email,
    password
  });

  const token = user.generateJWT();

  res.status(201).json(
    new ApiResponse(201, { token, user }, 'Account created successfully')
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = user.generateJWT();

  // Removing password before sending user object as response
  user.password = undefined;

  res.json(
    new ApiResponse(200, { token, user }, 'Login successful')
  );
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, req.user, 'User fetched successfully'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;
  
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  );

  res.json(new ApiResponse(200, updatedUser, 'Profile updated'));
});
