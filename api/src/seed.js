const { Usuario, Clase, Horario } = require('./database');

async function seed() {
  try {
    const usuarios = await Usuario.count();
    if (usuarios === 0) {
      console.log('🌱 Insertando usuarios...');
      await Usuario.bulkCreate([
        {
          nombre: 'Juan',
          apellidos: 'Pérez',
          email: 'juan@mail.com',
          contraseña_hash: '1234',
          telefono: '600111222',
          rol: 'cliente'
        },
        {
          nombre: 'Ana',
          apellidos: 'Gómez',
          email: 'ana@mail.com',
          contraseña_hash: '1234',
          telefono: '600333444',
          rol: 'profesor'
        },
        {
          nombre: 'Admin',
          apellidos: 'Root',
          email: 'admin@mail.com',
          contraseña_hash: 'admin',
          telefono: '600000000',
          rol: 'admin'
        }
      ]);
    }

    const clases = await Clase.count();
    if (clases === 0) {
      console.log('🌱 Insertando clases...');
      await Clase.bulkCreate([
        {
          nombre_clase: 'Yoga',
          descripcion: 'Clase de yoga',
          capacidad_maxima: 20,
          contenido_profesor: 'Respiración y estiramientos',
          id_profesor: 2
        }
      ]);
    }

    const horarios = await Horario.count();
    if (horarios === 0) {
      console.log('🌱 Insertando horarios...');
      await Horario.bulkCreate([
        {
          id_clase: 1,
          fecha: '2026-02-01',
          hora_inicio: '09:00',
          hora_fin: '10:00',
          lugar: 'Sala 1'
        }
      ]);
    }

    console.log('🌱 Seed completado');
  } catch (err) {
    console.error('❌ Error en seed:', err);
  }
}

module.exports = seed;
