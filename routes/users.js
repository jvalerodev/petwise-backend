import express from 'express';
import { registerValidator } from '../helpers/validators/users.js';
import { register } from '../controllers/users-controller.js';

const router = express.Router();

router.post('/register', registerValidator, register);

export default router;
