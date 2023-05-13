import { check } from 'express-validator';

export const createPetValidator = [
  check('name', 'Ingresa el nombre de la mascota').trim().notEmpty(),
  check('species', 'Ingresa la especie de la mascota').trim().notEmpty(),
  check('gender', 'Ingresa el género de la mascota').trim().notEmpty(),
  check('ownerName', 'Ingresa el nombre del propietario').trim().notEmpty(),
  check('ownerLastName', 'Ingresa el apellido del propietario')
    .trim()
    .notEmpty(),
  check('ownerEmail', 'Ingresa correo electrónico del propietario')
    .trim()
    .notEmpty(),
  check('ownerEmail', 'Correo electrónico inválido').trim().isEmail(),
  check('ownerDni', 'Ingresa DNI del propietario').trim().notEmpty()
];

export const updatePetValidator = [
  check('name', 'Ingresa nombre de la mascota').trim().notEmpty(),
  check('species', 'Ingresa la especie de la mascota').trim().notEmpty(),
  check('gender', 'Ingresa el género de la mascota').trim().notEmpty()
];
