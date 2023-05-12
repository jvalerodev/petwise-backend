import express from 'express';
import authMiddleware from '../middlewares/auth-middleware.js';
import { petValidator } from '../helpers/validators/pets.js';
import { createPet, getPets } from '../controllers/pets-controller.js';

const router = express.Router();

router.post('/create', authMiddleware, petValidator, createPet);

router.get('/', authMiddleware, getPets);

export default router;
