import { QueryTypes } from 'sequelize';
import db from '../config/database.js';

export const getOwners = async (req, res) => {
  const { id: vetId } = req.user;

  try {
    const [vet] = await db.query('SELECT * FROM vets WHERE id = $id', {
      bind: { id: vetId },
      type: QueryTypes.SELECT
    });

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
      GROUP BY owners.id;`;

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
