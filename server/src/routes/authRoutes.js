import express from 'express';
import { syncUser, getMe, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/sync', protect, syncUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
