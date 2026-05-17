import { auth } from '../config/firebase.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Access denied. No token provided.');
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    
    const { uid, email, name, picture } = decodedToken;
    const provider = decodedToken.firebase.sign_in_provider === 'google.com' ? 'google' : 'email';

    const user = await User.findOneAndUpdate(
      { firebaseUid: uid },
      { 
        email, 
        name: name || undefined, 
        avatar: picture || undefined, 
        firebaseUid: uid,
        provider
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    req.user = user;
    next();
  } catch (error) {
    if (error.code === 'auth/id-token-expired') {
      throw new ApiError(401, 'Session expired. Please login again.');
    }
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, 'Invalid token.');
  }
});

export { protect };
