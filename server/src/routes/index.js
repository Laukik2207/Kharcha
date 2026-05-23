import express from 'express';
import authRoutes from './authRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import insightRoutes from './insightRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import unknownMerchantRoutes from './unknownMerchantRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/expenses', expenseRoutes);
router.use('/upload', uploadRoutes);
router.use('/insights', insightRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/categories', categoryRoutes);
router.use('/unknown-merchants', unknownMerchantRoutes);

export default router;
