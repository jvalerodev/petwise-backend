import { check } from 'express-validator';

export const createAppointmentValidator = [
  check('petId', 'Ingresa la mascota').trim().notEmpty(),
  check('reason', 'Ingresa el motivo de la cita').trim().notEmpty(),
  check('date', 'Ingresa la fecha de la cita').trim().notEmpty()
];
