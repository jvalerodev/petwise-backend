import express from 'express';
import { createReportValidator } from '../helpers/validators/reports.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import { createReport } from '../controllers/reports-controller.js';

const router = express.Router();

router.post('/create', authMiddleware, createReportValidator, createReport);

export default router;
