import { DataTypes } from 'sequelize';
import db from '../config/database.js';

const User = db.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: 'TIMESTAMP'
    },
    updatedAt: {
      type: 'TIMESTAMP'
    }
  },
  { tableName: 'users' }
);

export default User;
