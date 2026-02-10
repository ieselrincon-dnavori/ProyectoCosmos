const express = require('express');
const cors = require('cors');
const { initDB, Usuario } = require('./database');
const seed = require('./seed');

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

/* ========= RUTAS ========= */

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

/* ========= LOGIN ========= */

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Usuario.findOne({
      where: { email, activo: true }
    });

    if (!user || user.password_hash !== password) {
      return res.status(401).json({
        error: 'Credenciales incorrectas'
      });
    }

    const userSafe = user.toJSON();
    delete userSafe.password_hash;

    res.json(userSafe);

  } catch (err) {
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});

/* ========= TEST ========= */

app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando 🚀' });
});

/* ========= START ========= */

async function startServer() {
  try {

    await initDB();
    await seed();

    const PORT = process.env.API_PORT || 3000;

    app.listen(PORT, () => {
      console.log(`🚀 API escuchando en puerto ${PORT}`);
    });

  } catch (err) {

    console.error("🔥 ERROR ARRANCANDO API:");
    console.error(err);
    process.exit(1);
  }
}

startServer();
