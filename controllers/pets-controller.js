import { validationResult } from 'express-validator';
import { QueryTypes } from 'sequelize';
import db from '../config/database.js';
import { getVet } from '../utils/functions.js';

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
    const vet = await getVet(vetId);

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
        'INSERT INTO owners (name, last_name, dni, email, created_at) VALUES ($ownerName, $ownerLastName, $ownerDni, $ownerEmail, $createdAt) RETURNING *;',
        {
          bind: {
            ownerName,
            ownerLastName,
            ownerDni,
            ownerEmail,
            createdAt: new Date()
          },
          type: QueryTypes.INSERT
        }
      );
    }

    // Create pet
    const [[pet]] = await db.query(
      'INSERT INTO pets (name, species, gender, age, weight, owner_id, vet_id, created_at) VALUES ($name, $species, $gender, $age, $weight, $ownerId, $vetId, $createdAt) RETURNING *;',
      {
        bind: {
          name,
          species,
          gender,
          age,
          weight,
          ownerId: owner.id,
          vetId: vet.id,
          createdAt: new Date()
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
    const vet = await getVet(vetId);

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

export const updatePet = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors.array()[0].msg;
    return res.status(400).json({ error });
  }

  const { id: vetId } = req.user;

  const { name, species, gender, age, weight } = req.body;
  const { petId } = req.params;

  try {
    const vet = await getVet(vetId);

    if (!vet) {
      return res
        .status(403)
        .json({ error: 'No tienes los permisos para editar mascotas' });
    }

    const query = `UPDATE pets SET name = $name, species = $species, gender = $gender, age = $age, weight = $weight, updated_at = $updatedAt
    WHERE id = $petId RETURNING id, name, species, gender, age, weight, created_at AS "createdAt", owner_id AS "ownerId";`;

    const [[pet]] = await db.query(query, {
      bind: {
        name,
        species,
        gender,
        age,
        weight,
        petId,
        updatedAt: new Date()
      },
      type: QueryTypes.UPDATE
    });

    const [owner] = await db.query(
      'SELECT name, last_name AS "lastName" FROM owners WHERE id = $ownerId',
      {
        bind: { ownerId: pet.ownerId },
        type: QueryTypes.SELECT
      }
    );

    const { ownerId, ...petRes } = pet;
    petRes.ownerName = owner.name;
    petRes.ownerLastName = owner.lastName;

    return res.status(200).json({ pet: petRes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};
