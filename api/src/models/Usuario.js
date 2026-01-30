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
    email: DataTypes.STRING,
    contraseña_hash: DataTypes.STRING,
    telefono: DataTypes.STRING,
    rol: DataTypes.STRING,
    fecha_registro: DataTypes.DATEONLY,
  }, {
    tableName: "usuario",
    timestamps: false,
  });
};
