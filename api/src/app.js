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
const bonosRouter = require('./routes/bonos');
const pagosRouter = require('./routes/pagos');


app.use('/usuarios', usuariosRouter);
app.use('/horarios', horariosRouter);
app.use('/reservas', reservasRouter);
app.use('/bonos', bonosRouter);
app.use('/pagos', pagosRouter);


// Login
app.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await Usuario.findOne({
      where: {
        email,
        activo: true
      }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Usuario no válido'
      });
    }

    // comprobar password
    if (user.password_hash !== password) {
      return res.status(401).json({
        error: 'Credenciales incorrectas'
      });
    }

    // 🔥 eliminar password antes de enviar
    const userSafe = user.toJSON();
    delete userSafe.password_hash;

    res.json(userSafe);

  } catch (err) {
    console.error(err);
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
