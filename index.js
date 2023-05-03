import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import db from './config/database.js';
import { userRoutes, authRoutes } from './routes/index.js';

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

db.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch((error) => console.log(error));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}.`);
});
