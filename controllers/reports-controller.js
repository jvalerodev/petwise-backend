import { validationResult } from 'express-validator';
import { QueryTypes } from 'sequelize';
import db from '../config/database.js';
import { getVet } from '../utils/functions.js';

export const createReport = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors.array()[0].msg;
    return res.status(400).json({ error });
  }

  const { id: vetId } = req.user;
  const { petId, diagnosis, treatment, indications } = req.body;

  try {
    // Get the vet
    const vet = await getVet(vetId);

    if (!vet) {
      return res
        .status(403)
        .json({ error: 'No tienes los permisos para crear un informe' });
    }

    const selectPetQuery = `SELECT pets.id, pets.name, owners.name AS "ownerName", owners.last_name AS "ownerLastName"
      FROM pets
      INNER JOIN owners ON owners.id = pets.owner_id
      WHERE pets.id = $petId AND vet_id = $vetId;`;

    const [pet] = await db.query(selectPetQuery, {
      bind: { petId, vetId: vet.id },
      type: QueryTypes.SELECT
    });

    const insertReportQuery = `INSERT INTO reports (date, diagnosis, treatment, indications, pet_id, vet_id, created_at)
      VALUES ($date, $diagnosis, $treatment, $indications, $petId, $vetId, $createdAt)
      RETURNING id, date, diagnosis, treatment, indications;`;

    const [[report]] = await db.query(insertReportQuery, {
      bind: {
        date: new Date(),
        diagnosis,
        treatment,
        indications,
        petId: pet.id,
        vetId: vet.id,
        createdAt: new Date()
      },
      type: QueryTypes.INSERT
    });

    report.petName = pet.name;
    report.ownerName = pet.ownerName;
    report.ownerLastName = pet.ownerLastName;

    return res.status(201).json({ report });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};

export const getReports = async (req, res) => {
  const { id: vetId } = req.user;
  const { petId } = req.params;

  try {
    // Get the vet
    const vet = await getVet(vetId);

    if (!vet) {
      return res
        .status(403)
        .json({ error: 'No tienes los permisos para ver los informes' });
    }

    const query = `SELECT reports.id, reports.date, reports.diagnosis, reports.treatment, reports.indications, pets.name AS "petName", owners.name AS "ownerName", owners.last_name AS "ownerLastName"
      FROM reports
      INNER JOIN pets ON pets.id = reports.pet_id
      INNER JOIN owners ON owners.id = pets.owner_id
      WHERE reports.pet_id = $petId AND reports.vet_id = $vetId;`;

    const reports = await db.query(query, {
      bind: { petId, vetId: vet.id },
      type: QueryTypes.SELECT
    });

    return res.status(200).json({ reports });
  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
