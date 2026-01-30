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
  const { email, password } = req.body;

  const user = await Usuario.findOne({ where: { email } });
  if (!user || user.contraseña_hash !== password) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  res.json(user);
});

// Test
app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando 🚀' });
});

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});
