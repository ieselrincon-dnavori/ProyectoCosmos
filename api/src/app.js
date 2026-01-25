const express = require('express');
const cors = require('cors');

const app = express(); // 👈 esto es lo que faltaba

app.use(cors());
app.use(express.json());

// Modelos
const Usuario = require('./models/Usuario');
//Rellenado de datos automáticos al iniciar.
const seed = require('./seed');
seed();


// Rutas
const usuariosRouter = require('./routes/usuarios');
app.use('/usuarios', usuariosRouter);

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Usuario.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuario no existe' });
    }

    if (user.contraseña_hash !== password) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando 🚀' });
});

// Puerto
const PORT = process.env.API_PORT || 3000;

app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});
