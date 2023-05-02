import { DataTypes } from 'sequelize';
import db from '../config/database.js';
import User from './User.js';

const Vet = db.define(
  'vet',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: 'TIMESTAMP'
    },
    updatedAt: {
      type: 'TIMESTAMP'
    }
  },
  { tableName: 'vets' }
);

export default Vet;
