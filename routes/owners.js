import express from 'express';
import authMiddleware from '../middlewares/auth-middleware.js';
import { getOwners, updateOwner } from '../controllers/owners-controller.js';
import { updateOwnerValidator } from '../helpers/validators/owners.js';
const router = express.Router();

router.get('/', authMiddleware, getOwners);

router.put(
  '/update/:ownerId',
  authMiddleware,
  updateOwnerValidator,
  updateOwner
);

export default router;
