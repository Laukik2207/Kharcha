import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getAllCategories,
  getUserRules,
  getSystemRules,
  createRule,
  updateRule,
  deleteRule,
  testRulePreview,
  recategorizeExpenses
} from '../controllers/categoryController.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllCategories);
router.get('/rules', getUserRules);
router.get('/rules/system', getSystemRules);
router.post('/rules', createRule);
router.put('/rules/:id', updateRule);
router.delete('/rules/:id', deleteRule);
router.post('/rules/test', testRulePreview);
router.post('/recategorize', recategorizeExpenses);

export default router;
