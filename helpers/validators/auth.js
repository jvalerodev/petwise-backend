import { check } from 'express-validator';

export const loginValidator = [
  check('email', 'Email is required.').trim().notEmpty(),
  check('email', 'Invalid email address.').trim().isEmail(),
  check('password', 'Password is required.').notEmpty()
];
