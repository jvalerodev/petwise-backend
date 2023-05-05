import { QueryTypes } from 'sequelize';
import { validationResult } from 'express-validator';
import db from '../config/database.js';
import { hashPassword } from '../helpers/passwords.js';

export const register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors.array()[0].msg;
    return res.status(400).json({ error });
  }

  const { name, lastName, email, password, role } = req.body;

  try {
    const [userExists] = await db.query(
      'SELECT * FROM users WHERE email = $email',
      { bind: { email }, type: QueryTypes.SELECT }
    );

    if (userExists) {
      return res.status(400).json({ error: 'This user already exists.' });
    }

    const hashedPassword = await hashPassword(password);
    const currentDate = new Date().toLocaleString();

    await db.query(
      `INSERT INTO users (email, password, role, created_at) VALUES ($email, $password, $role, '${currentDate}')`,
      {
        bind: { email, password: hashedPassword, role },
        type: QueryTypes.INSERT
      }
    );

    const [user] = await db.query('SELECT * FROM users WHERE email = $email', {
      bind: { email },
      type: QueryTypes.SELECT
    });

    await db.query(
      `INSERT INTO vets (user_id, name, last_name, email, created_at) VALUES ($userId, $name, $lastName, $email, '${currentDate}')`,
      {
        bind: { userId: user.id, name, lastName, email },
        type: QueryTypes.INSERT
      }
    );

    return res.status(201).json({ msg: 'User registered successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
