import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await User.create({
    name,
    email,
    password
  });

  if (user) {
    res.status(201).json(
      new ApiResponse(201, {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      }, 'User registered successfully')
    );
  } else {
    throw new ApiError(400, 'Invalid user data');
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.json(
      new ApiResponse(200, {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      }, 'Login successful')
    );
  } else {
    throw new ApiError(401, 'Invalid email or password');
  }
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, req.user, 'User profile fetched'));
});
