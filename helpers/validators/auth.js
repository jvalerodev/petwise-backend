import { check } from 'express-validator';

export const loginValidator = [
  check('email', 'Ingresa correo electróncio').trim().notEmpty(),
  check('email', 'Correo electrónico inválido').trim().isEmail(),
  check('password', 'Ingresa contraseña').notEmpty()
];
