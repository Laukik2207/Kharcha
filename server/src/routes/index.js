import express from 'express';
import authRoutes from './authRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import insightRoutes from './insightRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/expenses', expenseRoutes);
router.use('/upload', uploadRoutes);
router.use('/insights', insightRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
