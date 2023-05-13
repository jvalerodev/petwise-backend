import { QueryTypes } from 'sequelize';
import db from '../config/database.js';

export const getVet = async (id) => {
  const [vet] = await db.query('SELECT * FROM vets WHERE id = $id', {
    bind: { id },
    type: QueryTypes.SELECT
  });

  return vet;
};
