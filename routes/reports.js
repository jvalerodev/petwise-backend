import express from 'express';
import {
  createReportValidator,
  updateReportValidator
} from '../helpers/validators/reports.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import {
  createReport,
  getReports,
  updateReport,
  deleteReport
} from '../controllers/reports-controller.js';

const router = express.Router();

router.post('/create', authMiddleware, createReportValidator, createReport);

router.get('/:petId', authMiddleware, getReports);

router.put(
  '/update/:reportId',
  authMiddleware,
  updateReportValidator,
  updateReport
);

router.delete('/delete/:reportId', authMiddleware, deleteReport);

export default router;
