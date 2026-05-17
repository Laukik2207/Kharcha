import express from 'express';
import authRoutes from './authRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import insightRoutes from './insightRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/expenses', expenseRoutes);
router.use('/upload', uploadRoutes);
router.use('/insights', insightRoutes);

export default router;
