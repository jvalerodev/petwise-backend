import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Vet from '../models/Vet.js';
import { validatePassword } from '../helpers/passwords.js';

export const login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors.array()[0].msg;
    return res.status(400).json({ error });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    const passwordDb = user?.password || '';

    const isValidPassword = await validatePassword(password, passwordDb);

    if (!user || !isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const vet = await Vet.findOne({
      where: { userId: user.id },
      attributes: ['id', 'name', 'lastName', 'email']
    });

    const userForToken = {
      id: Number(vet.id),
      email: vet.email,
      name: vet.name,
      lastName: vet.lastName
    };

    const token = jwt.sign(userForToken, process.env.JWT_SECRET, {
      expiresIn: '5d'
    });

    const expire = new Date(new Date().getTime() + 86400000 * 5).toUTCString();

    res.cookie('api-token', token, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      expires: new Date(expire),
      sameSite: true,
      path: '/'
    });

    return res.status(200).json({ ...userForToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('api-token');
  return res.status(204).json({});
};

export const getUser = async (req, res) => {
  const { user } = req;

  try {
    const vet = await Vet.findByPk(user.id, {
      attributes: ['id', 'name', 'lastName', 'email']
    });

    const { id, name, lastName, email } = vet?.dataValues;

    return res.status(200).json({ id, name, lastName, email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};
