import { validationResult } from 'express-validator';
import { QueryTypes } from 'sequelize';
import db from '../config/database.js';
import { getVet } from '../utils/functions.js';

export const getOwners = async (req, res) => {
  const { id: vetId } = req.user;

  try {
    const vet = await getVet(vetId);

    if (!vet) {
      return res
        .status(403)
        .json({ error: 'No tienes los permisos para ver a los propietarios' });
    }

    const query = `SELECT owners.id, owners.name, owners.last_name AS "lastName", owners.dni, owners.email, owners.phone, owners.created_at AS "createdAt"
      FROM owners
      INNER JOIN pets ON pets.owner_id = owners.id
      INNER JOIN vets ON vets.id = pets.vet_id
      WHERE vets.id = $vetId
      GROUP BY owners.id
      ORDER BY owners.created_at;`;

    const owners = await db.query(query, {
      bind: { vetId },
      type: QueryTypes.SELECT
    });

    return res.status(200).json({ owners });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

export const updateOwner = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors.array()[0].msg;
    return res.status(400).json({ error });
  }

  const { id: vetId } = req.user;
  const { name, lastName, dni, email, phone } = req.body;
  const { ownerId } = req.params;

  try {
    const vet = await getVet(vetId);

    if (!vet) {
      return res
        .status(403)
        .json({ error: 'No tienes los permisos para editar propietarios' });
    }

    const query = `UPDATE owners SET name = $name, last_name = $lastName, dni = $dni, email = $email, phone = $phone, updated_at = $updatedAt
      WHERE id = $ownerId
      RETURNING id, name, last_name AS "lastName", dni, email, phone, created_at AS "createdAt";`;

    const [[owner]] = await db.query(query, {
      bind: {
        name,
        lastName,
        dni,
        email,
        phone: phone || null,
        updatedAt: new Date(),
        ownerId
      },
      type: QueryTypes.UPDATE
    });

    return res.status(200).json({ owner });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
