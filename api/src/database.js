const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

// MODELOS
const Usuario = require('./models/Usuario')(sequelize);
const Clase = require('./models/Clase')(sequelize);
const Horario = require('./models/Horario')(sequelize);
const Reserva = require('./models/Reserva')(sequelize);
const BonoPlan = require('./models/BonoPlan')(sequelize);
const Pago = require('./models/Pago')(sequelize);


// =======================
// RELACIONES
// =======================

// Clase ↔ Usuario (profesor)
Clase.belongsTo(Usuario, {
  foreignKey: 'id_profesor',
  as: 'profesor'
});
Usuario.hasMany(Clase, {
  foreignKey: 'id_profesor'
});

// Horario ↔ Clase
Horario.belongsTo(Clase, {
  foreignKey: 'id_clase'
});
Clase.hasMany(Horario, {
  foreignKey: 'id_clase'
});

// Reserva ↔ Horario
Reserva.belongsTo(Horario, {
  foreignKey: 'id_horario'
});
Horario.hasMany(Reserva, {
  foreignKey: 'id_horario'
});

// Reserva ↔ Usuario (cliente)
Reserva.belongsTo(Usuario, {
  foreignKey: 'id_cliente'
});
Usuario.hasMany(Reserva, {
  foreignKey: 'id_cliente'
});

// =======================
// INIT DB
// =======================

async function initDB() {
  await sequelize.authenticate();
  console.log('✅ Conectado a PostgreSQL');
  await sequelize.sync({ alter: false });
  console.log('🚀 Modelos sincronizados');
}

module.exports = {
  sequelize,
  initDB,
  Usuario,
  Clase,
  Horario,
  Reserva,
  BonoPlan,
  Pago
};
