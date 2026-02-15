const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { initDB, Usuario } = require('./database');
const seed = require('./seed');

const auth = require('./middleware/auth');

const app = express();

/* ========= MIDDLEWARE ========= */

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
const adminRouter = require('./routes/admin');
const adminClasesRouter = require('./routes/admin.clases');


// 🔥 TODAS protegidas
app.use('/usuarios', auth, usuariosRouter);
app.use('/horarios', auth, horariosRouter);
app.use('/reservas', auth, reservasRouter);
app.use('/bonos', auth, bonosRouter);
app.use('/pagos', auth, pagosRouter);
app.use('/admin', auth, adminRouter);
app.use('/admin', auth, adminClasesRouter);



/* ========= LOGIN (PÚBLICO) ========= */

app.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await Usuario.findOne({
      where: { email, activo: true }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Credenciales incorrectas'
      });
    }

    const passwordValida = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordValida) {
      return res.status(401).json({
        error: 'Credenciales incorrectas'
      });
    }

    const token = jwt.sign(
      {
        id: user.id_usuario,
        rol: user.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userSafe = user.toJSON();
    delete userSafe.password_hash;

    res.json({
      token,
      user: userSafe
    });

  } catch (err) {

    console.error(err);

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

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET no definido en variables de entorno");
    }

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
