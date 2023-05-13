import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import db from './config/database.js';
import {
  authRoutes,
  userRoutes,
  petRoutes,
  ownerRoutes
} from './routes/index.js';

dotenv.config();

const corsOptions = {
  origin: process.env.FRONTEND_URL.split(' '),
  credentials: true
};

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(morgan('dev'));

await db.authenticate();
console.log('Connection has been established successfully.');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/owners', ownerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}.`);
});
