const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define("Usuario", {

    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    nombre: DataTypes.STRING,
    apellidos: DataTypes.STRING,

    
    email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
    isEmail: true
  }
},
    password_hash: {
  type: DataTypes.STRING,
  field: 'contraseña_hash' // 👈 mantiene la columna real
},
    telefono: DataTypes.STRING,
    rol: DataTypes.STRING,

    fecha_registro: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },

    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }

  }, {
    tableName: "usuario",
    timestamps: false,
  });
};
