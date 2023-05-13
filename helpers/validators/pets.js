import { check } from 'express-validator';

export const createPetValidator = [
  check('name', 'Pet name is required.').trim().notEmpty(),
  check('species', 'Pet species is required.').trim().notEmpty(),
  check('gender', 'Pet gender is required.').trim().notEmpty(),
  check('ownerName', 'Owner name is required.').trim().notEmpty(),
  check('ownerLastName', 'Owner last name is required.').trim().notEmpty(),
  check('ownerEmail', 'Owner email is required.').trim().notEmpty(),
  check('ownerEmail', 'Invalid email address.').trim().isEmail(),
  check('ownerDni', 'Owner DNI is required.').trim().notEmpty()
];

export const updatePetValidator = [
  check('name', 'Pet name is required.').trim().notEmpty(),
  check('species', 'Pet species is required.').trim().notEmpty(),
  check('gender', 'Pet gender is required.').trim().notEmpty()
];
