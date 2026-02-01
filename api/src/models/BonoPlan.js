const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('BonoPlan', {

    id_bono: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    nombre_bono: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    precio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },

    duracion_dias: {
      type: DataTypes.INTEGER
    },

    num_sesiones: {
      type: DataTypes.INTEGER
    },

    descripcion: {
      type: DataTypes.TEXT
    }

  }, {
    tableName: 'bono_plan',
    timestamps: false
  });
};
