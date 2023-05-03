import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Vet from '../models/Vet.js';
import { hashPassword } from '../helpers/passwords.js';

export const register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors.array()[0].msg;
    return res.status(400).json({ error });
  }

  const { name, lastName, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ error: 'This user already exists.' });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      role
    });

    await Vet.create({ userId: user.id, name, lastName, email });

    return res.status(201).json({ msg: 'User registered successfully.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
