const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellidos: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  contraseña_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING(20),
  },
  rol: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  fecha_registro: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'usuario',
  timestamps: false,
});

module.exports = Usuario;
