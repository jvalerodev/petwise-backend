import { check } from 'express-validator';

export const registerValidator = [
  check('name', 'Ingresa tu nombre').trim().notEmpty(),
  check('lastName', 'Ingresa tu apellido').trim().notEmpty(),
  check('email', 'Ingresa correo electrónico').trim().notEmpty(),
  check('email', 'Correo electrónico inválido').trim().isEmail(),
  check('password', 'Ingresa contraseña').notEmpty(),
  check('password', 'La contraseña debe poseer al menos 6 caracteres').isLength(
    { min: 6 }
  ),
  check('role', 'Selecciona el rol').trim().notEmpty()
];
