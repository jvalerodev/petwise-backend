import express from 'express';
import { createAppointmentValidator } from '../helpers/validators/appointments.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import { createAppointment } from '../controllers/appointments-controller.js';

const router = express.Router();

router.post(
  '/create',
  authMiddleware,
  createAppointmentValidator,
  createAppointment
);

export default router;
