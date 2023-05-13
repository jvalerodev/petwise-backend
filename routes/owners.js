import express from 'express';
import authMiddleware from '../middlewares/auth-middleware.js';
import { getOwners } from '../controllers/owners-controller.js';

const router = express.Router();

router.get('/', authMiddleware, getOwners);

export default router;
