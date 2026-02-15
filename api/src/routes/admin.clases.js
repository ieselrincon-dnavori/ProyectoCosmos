const express = require('express');
const router = express.Router();

const { Clase, Usuario, Horario, Reserva } = require('../database');
const roles = require('../middleware/roles');

// 🔐 SOLO ADMIN
router.use(roles('admin'));


/* =========================
   GET PROFESORES
========================= */
router.get('/profesores', async (req, res) => {
  try {

    const profesores = await Usuario.findAll({
      where: {
        rol: 'profesor',
        activo: true
      },
      attributes: [
        'id_usuario',
        'nombre',
        'apellidos'
      ],
      order: [['nombre', 'ASC']]
    });

    res.json(profesores);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   🔥 GET CLASES ADMIN
========================= */
router.get('/clases', async (req, res) => {
  try {

    const horarios = await Horario.findAll({

      include: [
        {
          model: Clase,
          attributes: ['nombre_clase', 'capacidad_maxima'],
          include: [
            {
              model: Usuario,
              as: 'profesor',
              attributes: ['nombre', 'apellidos']
            }
          ]
        },
        {
          model: Reserva,
          where: { estado: 'activa' },
          required: false
        }
      ],

      order: [['fecha', 'ASC'], ['hora_inicio', 'ASC']]
    });

    const resultado = horarios.map(h => {

      const inscritos = h.Reservas?.length || 0;
      const capacidad = h.Clase.capacidad_maxima;
      const libres = capacidad - inscritos;

      let estado = 'disponible';

      if (libres <= 0) estado = 'llena';
      else if (libres <= 3) estado = 'casi llena';

      return {
        id_horario: h.id_horario,
        clase: h.Clase.nombre_clase,
        profesor: `${h.Clase.profesor.nombre} ${h.Clase.profesor.apellidos}`,
        fecha: h.fecha,
        hora_inicio: h.hora_inicio,
        capacidad,
        inscritos,
        libres,
        estado,
        reservas_abiertas: h.reservas_abiertas
      };

    });

    res.json(resultado);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: err.message });

  }
});


/* =========================
   CREAR CLASE
========================= */
router.post('/clases', async (req, res) => {
  try {

    const {
      nombre_clase,
      id_profesor,
      capacidad_maxima
    } = req.body;

    if (!nombre_clase || !id_profesor || !capacidad_maxima) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios'
      });
    }

    if (capacidad_maxima < 1 || capacidad_maxima > 50) {
      return res.status(400).json({
        error: 'Capacidad inválida'
      });
    }

    const profesor = await Usuario.findByPk(id_profesor);

    if (!profesor || profesor.rol !== 'profesor') {
      return res.status(404).json({
        error: 'Profesor no válido'
      });
    }

    const clase = await Clase.create({
      nombre_clase,
      id_profesor,
      capacidad_maxima
    });

    res.status(201).json(clase);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});


module.exports = router;
