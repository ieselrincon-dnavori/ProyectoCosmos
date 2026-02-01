const express = require('express');
const cors = require('cors');
const { initDB, Usuario } = require('./database');
const seed = require('./seed');
const app = express();

app.use(cors());
app.use(express.json());


(async () => {
  await initDB();
  await seed();
})();

// Rutas
const usuariosRouter = require('./routes/usuarios');
const horariosRouter = require('./routes/horarios');
const reservasRouter = require('./routes/reservas');


app.use('/usuarios', usuariosRouter);
app.use('/horarios', horariosRouter);
app.use('/reservas', reservasRouter);

// Login
app.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body;

    // 🔥 UNA SOLA QUERY
    const user = await Usuario.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Credenciales incorrectas'
      });
    }

    if (!user.activo) {
      return res.status(403).json({
        error: 'Usuario desactivado'
      });
    }

    if (user.contraseña_hash !== password) {
      return res.status(401).json({
        error: 'Credenciales incorrectas'
      });
    }

    // 🔐 quitar password antes de enviar
    const userSafe = user.toJSON();
    delete userSafe.contraseña_hash;

    res.json(userSafe);

  } catch (err) {
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});



// Test
app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando 🚀' });
});

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});
