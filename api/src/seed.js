const Usuario = require('./models/Usuario');
const sequelize = require('./database');

async function seed() {
  try {
    const count = await Usuario.count();
    if (count > 0) {
      console.log('🌱 Seed ya ejecutado, saltando...');
      return;
    }

    console.log('🌱 Insertando datos iniciales...');

    // ===== USUARIOS =====
    const [cliente, profesor, admin] = await Usuario.bulkCreate([
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
    ], { returning: true });

    console.log('✅ Usuarios creados');

    console.log('🌱 Seed completado correctamente');

  } catch (err) {
    console.error('❌ Error en seed:', err);
  }
}

module.exports = seed;
