import express from 'express';
import authMiddleware from '../middlewares/auth-middleware.js';
import { petValidator } from '../helpers/validators/pets.js';
import { createPet } from '../controllers/pets-controller.js';

const router = express.Router();

router.post('/create', authMiddleware, petValidator, createPet);

export default router;
