const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Horario', {
    id_horario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_clase: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false
    },
    reservas_abiertas: {
  type: DataTypes.BOOLEAN,
  defaultValue: true
},
    lugar: DataTypes.STRING
  }, {
    tableName: 'horario',
    timestamps: false
  });
};
