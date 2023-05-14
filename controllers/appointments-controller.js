import { validationResult } from 'express-validator';
import { getVet } from '../utils/functions.js';
import db from '../config/database.js';
import { QueryTypes } from 'sequelize';
import { getAppointmentsByDateRange } from '../helpers/appointmets/appointments.js';

export const createAppointment = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors.array()[0].msg;
    return res.status(400).json({ error });
  }

  const { id: vetId } = req.user;
  const { petId, reason, date } = req.body;

  try {
    // Get the vet
    const vet = await getVet(vetId);

    if (!vet) {
      return res
        .status(403)
        .json({ error: 'No tienes los permisos para crear una cita' });
    }

    const query = `SELECT pets.id, pets.name, owners.name AS "ownerName", owners.last_name AS "ownerLastName"
      FROM pets
      INNER JOIN vets ON vets.id = pets.vet_id
      INNER JOIN owners ON owners.id = pets.owner_id
      WHERE vets.id = $vetId AND pets.id = $petId
      ORDER BY pets.id;`;

    const [pet] = await db.query(query, {
      bind: { vetId: vet.id, petId },
      type: QueryTypes.SELECT
    });

    // Create appointment
    await db.query(
      'INSERT INTO appointments (date, reason, pet_id, vet_id, created_at) VALUES ($date, $reason, $petId, $vetId, $createdAt) RETURNING *;',
      {
        bind: {
          date,
          reason,
          petId: pet.id,
          vetId: vet.id,
          createdAt: new Date()
        },
        type: QueryTypes.INSERT
      }
    );

    const appointments = await getAppointmentsByDateRange(vet.id);
    return res.status(201).json({ appointments });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};

export const getAppointments = async (req, res) => {
  const { id: vetId } = req.user;

  try {
    // Get the vet
    const vet = await getVet(vetId);

    if (!vet) {
      return res
        .status(403)
        .json({ error: 'No tienes los permisos para ver las citas' });
    }

    const appointments = await getAppointmentsByDateRange(vet.id);
    return res.status(200).json({ appointments });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
