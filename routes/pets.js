import express from 'express';
import authMiddleware from '../middlewares/auth-middleware.js';
import {
  createPetValidator,
  updatePetValidator
} from '../helpers/validators/pets.js';
import {
  createPet,
  getPets,
  updatePet,
  deletePet
} from '../controllers/pets-controller.js';

const router = express.Router();

router.post('/create', authMiddleware, createPetValidator, createPet);
router.get('/', authMiddleware, getPets);
router.put('/update/:petId', authMiddleware, updatePetValidator, updatePet);
router.delete('/delete/:petId', authMiddleware, deletePet);

export default router;
