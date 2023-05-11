import { validationResult } from 'express-validator';
import { QueryTypes } from 'sequelize';
import db from '../config/database.js';

export const createPet = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors.array()[0].msg;
    return res.status(400).json({ error });
  }

  const {
    name,
    species,
    gender,
    age,
    weight,
    ownerName,
    ownerLastName,
    ownerDni,
    ownerEmail
  } = req.body;

  const currentDate = new Date().toLocaleString();

  const { id: vetId } = req.user;

  try {
    // Get the vet
    const [vet] = await db.query('SELECT * FROM vets WHERE id = $id', {
      bind: { id: vetId },
      type: QueryTypes.SELECT
    });

    if (!vet) {
      return res
        .status(403)
        .json({ error: 'No tienes los permisos para crear una mascota' });
    }

    // Get owner if already exists
    let [owner] = await db.query(
      'SELECT id, name, last_name AS "lastName" FROM owners WHERE dni = $ownerDni;',
      {
        bind: { ownerDni },
        type: QueryTypes.SELECT
      }
    );

    // Create owner if does not exists
    if (!owner) {
      [[owner]] = await db.query(
        `INSERT INTO owners (name, last_name, dni, email, created_at) VALUES ($ownerName, $ownerLastName, $ownerDni, $ownerEmail, '${currentDate}') RETURNING *;`,
        {
          bind: { ownerName, ownerLastName, ownerDni, ownerEmail },
          type: QueryTypes.INSERT
        }
      );
    }

    // Create pet
    const [[pet]] = await db.query(
      `INSERT INTO pets (name, species, gender, age, weight, owner_id, vet_id, created_at) VALUES ($name, $species, $gender, $age, $weight, $ownerId, $vetId, '${currentDate}') RETURNING *;`,
      {
        bind: {
          name,
          species,
          gender,
          age,
          weight,
          ownerId: owner.id,
          vetId: vet.id
        }
      }
    );

    return res.status(200).json({
      id: Number(pet.id),
      name: pet.name,
      species: pet.species,
      age: pet.age,
      weight: Number(pet.weight),
      owner: `${owner.name} ${owner.lastName}`,
      createdAt: pet.createdAt
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};
