const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

// Cargar modelos
require("./models/Usuario");

sequelize.authenticate()
  .then(() => {
    console.log("✅ Conectado a PostgreSQL");
    return sequelize.sync();
  })
  .then(() => console.log("🚀 Modelos sincronizados correctamente"))
  .catch(err => console.error("❌ Error en la base de datos:", err));

module.exports = sequelize;
