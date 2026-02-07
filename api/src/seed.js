const { Usuario, Clase, Horario, Reserva } = require('./database');

async function seed() {

  console.log("🌱 Ejecutando seed PRO...");

  // Evitar duplicados
  const usuarios = await Usuario.count();
  if (usuarios > 0) {
    console.log("🌱 Seed ya ejecutado");
    return;
  }

  /*
  ========================
  USUARIOS
  ========================
  */

  const clientes = [];

  for (let i = 1; i <= 15; i++) {
    clientes.push({
      nombre: `Cliente${i}`,
      apellidos: 'Fitness',
      email: `cliente${i}@mail.com`,
      password_hash: '1234',
      telefono: '600000000',
      rol: 'cliente',
      fecha_registro: new Date(),
      activo:true
    });
  }

  const usuariosCreados = await Usuario.bulkCreate([
    {
      nombre: 'Admin',
      apellidos: 'Root',
      email: 'admin@mail.com',
      password_hash: 'admin',
      rol: 'admin'
      ,
      activo:true
    },
    {
      nombre: 'Ana',
      apellidos: 'Yoga',
      email: 'ana@mail.com',
      password_hash: '1234',
      rol: 'profesor',
      activo:true
    },
    {
      nombre: 'Carlos',
      apellidos: 'Crossfit',
      email: 'carlos@mail.com',
      password_hash: '1234',
      rol: 'profesor',
      activo:true
    },
    ...clientes
  ]);

  console.log("✅ Usuarios creados");


  /*
  ========================
  CLASES
  ========================
  */

  const clases = await Clase.bulkCreate([
    {
      nombre_clase: 'Yoga',
      descripcion: 'Clase relajante',
      capacidad_maxima: 20,
      id_profesor: 2
    },
    {
      nombre_clase: 'CrossFit',
      descripcion: 'Alta intensidad',
      capacidad_maxima: 15,
      id_profesor: 3
    }
  ]);

  console.log("✅ Clases creadas");


  /*
  ========================
  HORARIOS
  ========================
  */

  const horarios = await Horario.bulkCreate([
    {
      id_clase: 1,
      fecha: '2026-02-01',
      hora_inicio: '09:00',
      hora_fin: '10:00',
      lugar: 'Sala 1',
      reservas_abiertas: true
    },
    {
      id_clase: 2,
      fecha: '2026-02-01',
      hora_inicio: '18:00',
      hora_fin: '19:00',
      lugar: 'Sala 2',
      reservas_abiertas: true
    }
  ]);

  console.log("✅ Horarios creados");


  /*
  ========================
  RESERVAS ALEATORIAS
  ========================
  */

  const reservas = [];

  for (let i = 4; i <= 12; i++) {
    reservas.push({
      id_cliente: i,
      id_horario: 1,
      estado: 'activa'
    });
  }

  await Reserva.bulkCreate(reservas);

  console.log("✅ Reservas creadas");

  console.log("🔥 SEED PRO COMPLETADO");
}

/*
========================
BONOS
========================
*/
const { Usuario, Clase, Horario, Reserva, BonoPlan } = require('./database');

await BonoPlan.bulkCreate([
  {
    nombre_bono: 'Bono mensual',
    precio: 40,
    duracion_dias: 30,
    descripcion: 'Acceso ilimitado durante 30 días'
  },
  {
    nombre_bono: 'Bono 10 sesiones',
    precio: 50,
    num_sesiones: 10,
    descripcion: '10 accesos al gimnasio'
  },
  {
    nombre_bono: 'Bono anual',
    precio: 400,
    duracion_dias: 365,
    descripcion: 'Acceso ilimitado durante 1 año'
  }
]);

console.log("✅ Bonos creados");

//Exports

module.exports = seed;
