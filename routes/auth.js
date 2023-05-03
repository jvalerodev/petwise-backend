import express from 'express';
import { loginValidator } from '../helpers/validators/auth.js';
import { login, logout, getUser } from '../controllers/auth-controller.js';
import authMiddleware from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/login', loginValidator, login);
router.post('/logout', logout);

router.get('/user', authMiddleware, getUser);

export default router;
