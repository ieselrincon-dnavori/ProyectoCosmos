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

    metodo_pago: DataTypes.STRING,

    fecha_vencimiento: DataTypes.DATEONLY,

    sesiones_restantes: {
      type: DataTypes.INTEGER,
      allowNull: true
    }

  }, {
  tableName: 'pago',
  timestamps: false,
  indexes: [
    { fields: ['id_cliente'] },
    { fields: ['sesiones_restantes'] },
    { fields: ['fecha_vencimiento'] }
  ]
});
//FIN
};
