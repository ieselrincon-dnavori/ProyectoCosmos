const bcrypt = require('bcrypt');
const { Usuario, Clase, Horario, Reserva, BonoPlan, Pago } = require('./database');

function randomDate(monthsBack = 6) {
  const now = new Date();
  const past = new Date();
  past.setMonth(now.getMonth() - monthsBack);

  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime())
  );
}

async function hash(password) {
  return bcrypt.hash(password, 10);
}

async function seed() {

  console.log("🌱 Ejecutando SEED ULTRA PRO...");

  const usuariosExistentes = await Usuario.count();
  if (usuariosExistentes > 0) {
    console.log("🌱 Seed ya ejecutado");
    return;
  }

  const pass123 = await hash("123");
  const passAdmin = await hash("admin123");

  /*
  ========================
  ADMIN
  ========================
  */

  await Usuario.create({
    nombre: 'Admin',
    apellidos: 'Root',
    email: 'admin@mail.com',
    password_hash: passAdmin,
    rol: 'admin',
    activo: true
  });

  /*
  ========================
  PROFESORES
  ========================
  */

  const profesoresData = [
    ['Ana','Yoga'],
    ['Carlos','Crossfit'],
    ['Laura','Pilates'],
    ['Sergio','Spinning'],
    ['Marta','HIIT'],
    ['David','Boxeo'],
    ['Elena','Zumba']
  ];

  const profesores = [];

  for (const [nombre, especialidad] of profesoresData) {
    profesores.push(await Usuario.create({
      nombre,
      apellidos: especialidad,
      email: `${nombre.toLowerCase()}@mail.com`,
      password_hash: pass123,
      rol: 'profesor',
      telefono: '600000000',
      fecha_registro: randomDate(12),
      activo: true
    }));
  }

  /*
  ========================
  CLIENTES (150 + crecimiento)
  ========================
  */

  const clientes = [];

  for (let i = 1; i <= 100; i++) {
    clientes.push(await Usuario.create({
      nombre: `Cliente${i}`,
      apellidos: `Apellido${i}`,
      email: `cliente${i}@mail.com`,
      password_hash: pass123,
      telefono: '600000000',
      rol: 'cliente',
      fecha_registro: randomDate(10),
      activo: true
    }));
  }

  // Crecimiento últimos 3 meses
  for (let i = 0; i < 50; i++) {
    clientes.push(await Usuario.create({
      nombre: `Nuevo${i}`,
      apellidos: `Cliente${i}`,
      email: `nuevo${i}@mail.com`,
      password_hash: pass123,
      telefono: '600000000',
      rol: 'cliente',
      fecha_registro: randomDate(3),
      activo: true
    }));
  }

  console.log("✅ Clientes generados con crecimiento realista");

  /*
  ========================
  CLASES
  ========================
  */

  const nombresClases = [
    'Yoga','CrossFit','Pilates','Spinning',
    'HIIT','Boxeo','Zumba','Funcional','Core','Movilidad'
  ];

  const clases = [];

  for (let i = 0; i < nombresClases.length; i++) {
    clases.push(await Clase.create({
      nombre_clase: nombresClases[i],
      descripcion: `Clase profesional de ${nombresClases[i]}`,
      capacidad_maxima: 20 + Math.floor(Math.random() * 15),
      id_profesor: profesores[i % profesores.length].id_usuario
    }));
  }

  console.log("✅ Clases creadas");

  /*
  ========================
  HORARIOS (90 días atrás + 30 futuros)
  ========================
  */

  const horarios = [];

  for (let i = -90; i <= 30; i++) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + i);

    const claseRandom = clases[Math.floor(Math.random() * clases.length)];

    horarios.push(await Horario.create({
      id_clase: claseRandom.id_clase,
      fecha,
      hora_inicio: '18:00',
      hora_fin: '19:00',
      lugar: 'Sala Principal',
      reservas_abiertas: i >= 0
    }));
  }

  console.log("✅ Historial de horarios generado");

  /*
  ========================
  BONOS
  ========================
  */

  const bonos = await BonoPlan.bulkCreate([
    {
      nombre_bono: 'Mensual',
      precio: 45,
      duracion_dias: 30,
      descripcion: 'Acceso ilimitado'
    },
    {
      nombre_bono: '10 sesiones',
      precio: 60,
      num_sesiones: 10,
      descripcion: 'Flexible'
    },
    {
      nombre_bono: 'Pase diario',
      precio: 8,
      duracion_dias: 1,
      descripcion: 'Plan casual'
    }
  ]);

  console.log("✅ Bonos creados");

  /*
  ========================
  PAGOS (12 meses históricos)
  ========================
  */

  const pagos = [];

  for (const cliente of clientes) {

    const numPagos = 1 + Math.floor(Math.random() * 4);

    for (let i = 0; i < numPagos; i++) {

      const plan = bonos[Math.floor(Math.random() * bonos.length)];
      const fechaPago = randomDate(12);

      pagos.push({
        id_cliente: cliente.id_usuario,
        id_bono: plan.id_bono,
        monto: plan.precio,
        fecha_pago: fechaPago,
        fecha_vencimiento: new Date(
          fechaPago.getTime() + (plan.duracion_dias || 60) * 86400000
        ),
        sesiones_restantes: plan.num_sesiones || 999
      });
    }
  }

  await Pago.bulkCreate(pagos);

  console.log("✅ Historial financiero avanzado generado");

  /*
  ========================
  RESERVAS CON OCUPACIÓN REAL
  ========================
  */

  const reservas = [];

  for (const horario of horarios) {

    const clase = clases.find(c => c.id_clase === horario.id_clase);
    const capacidad = clase.capacidad_maxima;

    const ocupacion =
      horario.fecha < new Date()
        ? Math.floor(capacidad * (0.4 + Math.random() * 0.6))
        : Math.floor(capacidad * Math.random() * 0.7);

    for (let i = 0; i < ocupacion; i++) {

      const cliente =
        clientes[Math.floor(Math.random() * clientes.length)];

      reservas.push({
        id_cliente: cliente.id_usuario,
        id_horario: horario.id_horario,
        estado: horario.fecha < new Date()
          ? 'completada'
          : 'activa'
      });
    }
  }

  await Reserva.bulkCreate(reservas);

  console.log("✅ Ocupación realista generada");

  console.log("🔥 SEED ULTRA PRO COMPLETADO");
}

module.exports = seed;
