const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Reserva', {
    id_reserva: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_horario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha_reserva: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'activa'
    }
  }, {
    tableName: 'reserva',
    timestamps: false
  });
};
