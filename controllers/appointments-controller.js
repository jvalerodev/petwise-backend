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

    const [pet] = await db.query(
      'SELECT id, name FROM pets WHERE id = $petId AND vet_id = $vetId;',
      {
        bind: { petId, vetId: vet.id },
        type: QueryTypes.SELECT
      }
    );

    // Create appointment
    await db.query(
      'INSERT INTO appointments (date, reason, pet_id, vet_id, created_at) VALUES ($date, $reason, $petId, $vetId, $createdAt);',
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

export const updateAppointment = async (req, res) => {
  const { id: vetId } = req.user;
  const { appointmentId } = req.params;
  const { reason, date } = req.body;

  try {
    // Get the vet
    const vet = await getVet(vetId);

    if (!vet) {
      return res
        .status(403)
        .json({ error: 'No tienes los permisos para editar citas' });
    }

    await db.query(
      'UPDATE appointments SET reason = $reason, date = $date, updated_at = $updatedAt WHERE id = $appointmentId AND vet_id = $vetId',
      {
        bind: {
          reason,
          date,
          updatedAt: new Date(),
          appointmentId,
          vetId: vet.id
        },
        type: QueryTypes.UPDATE
      }
    );

    return res.status(204).json({});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};

export const deleteAppointment = async (req, res) => {
  const { id: vetId } = req.user;
  const { appointmentId } = req.params;

  try {
    // Get the vet
    const vet = await getVet(vetId);

    if (!vet) {
      return res
        .status(403)
        .json({ error: 'No tienes los permisos para eliminar citas' });
    }

    await db.query(
      'DELETE FROM appointments WHERE id = $appointmentId AND vet_id = $vetId;',
      {
        bind: {
          appointmentId,
          vetId: vet.id
        },
        type: QueryTypes.DELETE
      }
    );

    return res.status(204).json({});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
