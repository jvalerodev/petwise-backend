import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const {
  DATABASE_DIALECT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PORT
} = process.env;

const db = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
  host: DATABASE_HOST,
  port: DATABASE_PORT,
  dialect: DATABASE_DIALECT,
  pool: { max: 5, min: 0, acquire: 90000, idle: 10000 },
  logging: false,
  language: 'en',
  define: {
    underscored: true
  },
  dialectOptions: {
    decimalNumbers: true
  }
});

export default db;
