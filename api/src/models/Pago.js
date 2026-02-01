const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Pago', {

    id_pago: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    id_bono: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    fecha_pago: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    monto: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },

    metodo_pago: {
      type: DataTypes.STRING
    },

    fecha_vencimiento: {
      type: DataTypes.DATEONLY
    }

  }, {
    tableName: 'pago',
    timestamps: false
  });
};
