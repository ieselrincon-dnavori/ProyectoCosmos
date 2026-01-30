const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Clase', {
    id_clase: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_clase: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: DataTypes.TEXT,
    capacidad_maxima: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    contenido_profesor: DataTypes.TEXT,
    id_profesor: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'clase',
    timestamps: false
  });
};
