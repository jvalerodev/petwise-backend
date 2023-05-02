import { check } from 'express-validator';

export const registerValidator = [
  check('name', 'Name is required.').trim().notEmpty(),
  check('lastName', 'Last name is required.').trim().notEmpty(),
  check('email', 'Email is required.').trim().notEmpty(),
  check('email', 'Invalid email address.').trim().isEmail(),
  check('password', 'Password is required.').notEmpty(),
  check('password', 'The password must be at least 6 characters.').isLength({
    min: 6
  }),
  check('role', 'Role is required.').trim().notEmpty()
];
