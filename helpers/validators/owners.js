import { check } from 'express-validator';

export const updateOwnerValidator = [
  check('name', 'Ingresa el nombre').trim().notEmpty(),
  check('lastName', 'Ingresa el apellido').trim().notEmpty(),
  check('dni', 'Ingresa el DNI').trim().notEmpty(),
  check('email', 'Ingresa el correo electrónico').trim().notEmpty(),
  check('email', 'Correo electrónico inválido').trim().isEmail()
];
