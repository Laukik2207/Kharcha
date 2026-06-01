import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getMonthlySummary,
  getCategorySummary,
  getYearlySummary,
  getDailyTrend,
  getTopMerchants,
  getPaymentMethodBreakdown,
  getAvailableDates
} from '../controllers/analyticsController.js';

const router = express.Router();

router.use(protect);

router.get('/available-dates', getAvailableDates);
router.get('/monthly', getMonthlySummary);
router.get('/categories', getCategorySummary);
router.get('/yearly', getYearlySummary);
router.get('/daily', getDailyTrend);
router.get('/merchants', getTopMerchants);
router.get('/payment-methods', getPaymentMethodBreakdown);

export default router;
