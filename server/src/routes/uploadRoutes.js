import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { uploadSingle, uploadErrorHandler } from '../middleware/uploadMiddleware.js';
import { 
  uploadStatement, 
  getUploadHistory, 
  getUploadStatus, 
  deleteUploadRecord,
  getSignedUrl
} from '../controllers/uploadController.js';

const router = express.Router();

router.use(protect);

router.post('/', uploadSingle, uploadErrorHandler, uploadStatement);
router.get('/history', getUploadHistory);
router.get('/status/:id', getUploadStatus);
router.delete('/:id', deleteUploadRecord);
router.get('/signed-url/:id', getSignedUrl);

export default router;
