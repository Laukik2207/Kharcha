import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  getExpenses, 
  getExpenseById, 
  createExpense, 
  updateExpense, 
  deleteExpense, 
  getExpenseSummary 
} from '../controllers/expenseController.js';

const router = express.Router();

router.use(protect);

router.get('/', getExpenses);
router.get('/summary', getExpenseSummary);
router.get('/:id', getExpenseById);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;
