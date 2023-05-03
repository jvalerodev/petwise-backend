import express from 'express';
import { loginValidator } from '../helpers/validators/auth.js';
import { login, logout } from '../controllers/auth-controller.js';

const router = express.Router();

router.post('/login', loginValidator, login);
router.post('/logout', logout);

export default router;
