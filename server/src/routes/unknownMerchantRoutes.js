import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getUnknownMerchants,
  getUnknownCount,
  assignCategory,
  assignCategoryBulk,
  dismissMerchant
} from '../controllers/unknownMerchantController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getUnknownMerchants);

router.route('/count')
  .get(getUnknownCount);

router.route('/assign')
  .post(assignCategory);

router.route('/assign-bulk')
  .post(assignCategoryBulk);

router.route('/dismiss')
  .post(dismissMerchant);

export default router;
