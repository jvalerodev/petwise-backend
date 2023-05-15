import { check } from 'express-validator';

export const createReportValidator = [
  check('petId', 'Ingresa la mascota').trim().notEmpty(),
  check('diagnosis', 'Ingresa el diagnóstico').trim().notEmpty(),
  check('treatment', 'Ingresa el tratamiento').trim().notEmpty(),
  check('indications', 'Ingresa las indicaciones').trim().notEmpty()
];

export const updateReportValidator = [
  check('diagnosis', 'Ingresa el diagnóstico').trim().notEmpty(),
  check('treatment', 'Ingresa el tratamiento').trim().notEmpty(),
  check('indications', 'Ingresa las indicaciones').trim().notEmpty()
];
