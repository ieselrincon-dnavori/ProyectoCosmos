const { Usuario, Clase, Horario, Reserva, BonoPlan } = require('./database');

async function seed() {

  console.log("🌱 Ejecutando seed PRO...");

  // Evitar duplicados
  const usuariosExistentes = await Usuario.count();
  if (usuariosExistentes > 0) {
    console.log("🌱 Seed ya ejecutado");
    return;
  }

  /*
  ========================
  USUARIOS
  ========================
  */

  // Lista de nombres reales para generar un entorno de prueba verosímil
  const dataClientes = [
    { nombre: 'Javier', apellidos: 'García López', email: 'j.garcia@mail.com' },
    { nombre: 'Lucía', apellidos: 'Sánchez Pérez', email: 'lucia.sanchez@mail.com' },
    { nombre: 'Marcos', apellidos: 'Rodríguez Ruiz', email: 'm.rodriguez@mail.com' },
    { nombre: 'Elena', apellidos: 'Martínez Castro', email: 'elena.mtz@mail.com' },
    { nombre: 'Ricardo', apellidos: 'Gómez Ferri', email: 'r.gomez@mail.com' },
    { nombre: 'Sofía', apellidos: 'Morales Soler', email: 'sofia.fitness@mail.com' },
    { nombre: 'Diego', apellidos: 'Navarro Valls', email: 'd.navarro@mail.com' },
    { nombre: 'Valeria', apellidos: 'Méndez Ortiz', email: 'v.mendez@mail.com' },
    { nombre: 'Adrián', apellidos: 'Vázquez Gil', email: 'adrian.vazquez@mail.com' },
    { nombre: 'Marta', apellidos: 'Ibáñez Beltrán', email: 'marta.ib@mail.com' },
    { nombre: 'Raúl', apellidos: 'Cano Ramos', email: 'raul.cano@mail.com' },
    { nombre: 'Isabel', apellidos: 'Torres Sanz', email: 'i.torres@mail.com' },
    { nombre: 'Pablo', apellidos: 'Herrero León', email: 'p.herrero@mail.com' },
    { nombre: 'Carmen', apellidos: 'Jiménez Nieto', email: 'c.jimenez@mail.com' },
    { nombre: 'Hugo', apellidos: 'Pascual Vidal', email: 'h.pascual@mail.com' }
  ];

  const clientes = dataClientes.map(c => ({
    ...c,
    password_hash: '123', // Contraseña unificada
    telefono: '600000000',
    rol: 'cliente',
    fecha_registro: new Date(),
    activo: true
  }));

  const usuariosCreados = await Usuario.bulkCreate([
    {
      nombre: 'Admin',
      apellidos: 'Root',
      email: 'admin@mail.com',
      password_hash: 'admin123', // Se mantiene según instrucción
      rol: 'admin',
      activo: true
    },
    {
      nombre: 'Ana',
      apellidos: 'Yoga',
      email: 'ana@mail.com',
      password_hash: '123',
      rol: 'profesor',
      activo: true
    },
    {
      nombre: 'Carlos',
      apellidos: 'Crossfit',
      email: 'carlos@mail.com',
      password_hash: '123',
      rol: 'profesor',
      activo: true
    },
    ...clientes
  ]);

  console.log("✅ Usuarios creados con datos reales");


  /*
  ========================
  CLASES
  ========================
  */

  const clases = await Clase.bulkCreate([
    {
      nombre_clase: 'Yoga',
      descripcion: 'Sesión de Hatha Yoga para mejorar flexibilidad y reducir estrés.',
      capacidad_maxima: 20,
      id_profesor: 2
    },
    {
      nombre_clase: 'CrossFit',
      descripcion: 'Entrenamiento funcional de alta intensidad para fuerza y potencia.',
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
      lugar: 'Sala A - Zen',
      reservas_abiertas: true
    },
    {
      id_clase: 2,
      fecha: '2026-02-01',
      hora_inicio: '18:00',
      hora_fin: '19:00',
      lugar: 'Box Principal',
      reservas_abiertas: true
    }
  ]);

  console.log("✅ Horarios creados");


  /*
  ========================
  RESERVAS (Ejemplos)
  ========================
  */

  const reservas = [];
  // Asignamos a los primeros 8 clientes reales a la clase de Yoga
  for (let i = 4; i <= 12; i++) {
    reservas.push({
      id_cliente: i,
      id_horario: 1,
      estado: 'activa'
    });
  }

  await Reserva.bulkCreate(reservas);
  console.log("✅ Reservas creadas");

  /*
  ========================
  BONOS / PLANES
  ========================
  */

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
      descripcion: '10 accesos al gimnasio sin caducidad mensual'
    },
    {
      nombre_bono: 'Bono anual',
      precio: 400,
      duracion_dias: 365,
      descripcion: 'Acceso ilimitado durante 1 año (Ahorro del 15%)'
    }
  ]);

  console.log("✅ Bonos creados");
  console.log("🔥 SEED PRO COMPLETADO");

}

module.exports = seed;