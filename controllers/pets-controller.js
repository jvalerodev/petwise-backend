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
      'SELECT id, name, last_name FROM owners WHERE dni = $ownerDni;',
      {
        bind: { ownerDni },
        type: QueryTypes.SELECT
      }
    );

    // Create owner if does not exists
    if (!owner) {
      [[owner]] = await db.query(
        'INSERT INTO owners (name, last_name, dni, email, created_at) VALUES ($ownerName, $ownerLastName, $ownerDni, $ownerEmail, CURRENT_TIMESTAMP) RETURNING *;',
        {
          bind: { ownerName, ownerLastName, ownerDni, ownerEmail },
          type: QueryTypes.INSERT
        }
      );
    }

    // Create pet
    const [[pet]] = await db.query(
      'INSERT INTO pets (name, species, gender, age, weight, owner_id, vet_id, created_at) VALUES ($name, $species, $gender, $age, $weight, $ownerId, $vetId, CURRENT_TIMESTAMP) RETURNING *;',
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

    const petRes = {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      gender: pet.gender,
      age: pet.age,
      weight: pet.weight,
      ownerName: owner.name,
      ownerLastName: owner.last_name,
      createdAt: pet.created_at
    };

    return res.status(200).json({ pet: petRes });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};

export const getPets = async (req, res) => {
  const { id: vetId } = req.user;

  try {
    const [vet] = await db.query('SELECT * FROM vets WHERE id = $id', {
      bind: { id: vetId },
      type: QueryTypes.SELECT
    });

    if (!vet) {
      return res
        .status(403)
        .json({ error: 'No tienes los permisos para ver las mascotas' });
    }

    const query = `SELECT pets.id, pets.name, pets.species, pets.gender, pets.age, pets.weight, pets.created_at AS "createdAt", owners.name AS "ownerName", owners.last_name AS "ownerLastName"
      FROM pets
      INNER JOIN vets ON vets.id = pets.vet_id
      INNER JOIN owners ON owners.id = pets.owner_id
      WHERE vets.id = $vetId
      ORDER BY pets.id;`;

    const pets = await db.query(query, {
      bind: { vetId },
      type: QueryTypes.SELECT
    });

    res.status(200).json({ pets });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
