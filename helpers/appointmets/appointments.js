import { QueryTypes } from 'sequelize';
import db from '../../config/database.js';

export const getAppointmentsByDateRange = async (vetId) => {
  const today = new Date();

  const query = `SELECT appoint.id, appoint.date, appoint.reason, pets.name AS "petName", owners.name AS "ownerName", owners.last_name AS "ownerLastName"
    FROM appointments AS appoint
    INNER JOIN pets ON pets.id = appoint.pet_id
    INNER JOIN owners ON owners.id = pets.owner_id
    WHERE appoint.vet_id = $vetId`;

  const orderBy = 'ORDER BY appoint.date;';

  const todayQuery = 'AND appoint.date = $today';
  const futureQuery = 'AND appoint.date > $today';

  const todayAppointments = await db.query(
    `${query} ${todayQuery} ${orderBy}`,
    {
      bind: { vetId, today },
      type: QueryTypes.SELECT
    }
  );

  const futureAppointments = await db.query(`${query} ${futureQuery}`, {
    bind: { vetId, today },
    type: QueryTypes.SELECT
  });

  return { today: todayAppointments, future: futureAppointments };
};
