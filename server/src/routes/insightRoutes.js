import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getMonthlySummary,
  getSavingsRecommendations,
  getAnomalyDetection,
  getSpendingPatterns,
  getBudgetAdvice,
  refreshInsight,
  getInsightHistory,
  getCompleteAnalysis
} from '../controllers/insightController.js';

const router = express.Router();

router.get('/all', protect, getCompleteAnalysis);

router.use(protect);

router.route('/summary').get(getMonthlySummary);
router.route('/savings').get(getSavingsRecommendations);
router.route('/anomalies').get(getAnomalyDetection);
router.route('/patterns').get(getSpendingPatterns);
router.route('/budget').post(getBudgetAdvice);
router.route('/refresh').post(refreshInsight);
router.route('/history').get(getInsightHistory);

export default router;
