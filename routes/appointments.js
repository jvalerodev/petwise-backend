import express from 'express';
import {
  createAppointmentValidator,
  updateAppointmentValidator
} from '../helpers/validators/appointments.js';
import authMiddleware from '../middlewares/auth-middleware.js';
import {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointments-controller.js';

const router = express.Router();

router.post(
  '/create',
  authMiddleware,
  createAppointmentValidator,
  createAppointment
);

router.get('/', authMiddleware, getAppointments);

router.put(
  '/update/:appointmentId',
  authMiddleware,
  updateAppointmentValidator,
  updateAppointment
);

router.delete('/delete/:appointmentId', authMiddleware, deleteAppointment);

export default router;
