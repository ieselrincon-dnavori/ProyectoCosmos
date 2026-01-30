const express = require('express');
const router = express.Router();
const { Horario, Clase, Usuario, Reserva } = require('../database');

router.get('/', async (req, res) => {
  try {
    const id_cliente = req.query.id_cliente;

    const horarios = await Horario.findAll({
      include: [
        {
          model: Clase,
          include: [
            {
              model: Usuario,
              as: 'profesor',
              attributes: ['id_usuario', 'nombre', 'apellidos']
            }
          ]
        },
        {
          model: Reserva,
          where: { estado: 'activa' },
          required: false
        }
      ]
    });

    const resultado = horarios.map(h => {
      const reservas = h.Reservas || [];

      const yaReservado = id_cliente
        ? reservas.some(r => r.id_cliente == id_cliente)
        : false;

      const plazas_ocupadas = reservas.length;
      const plazas_totales = h.Clase.capacidad_maxima;

      return {
        ...h.toJSON(),
        plazas_ocupadas,
        plazas_totales,
        plazas_disponibles: plazas_ocupadas < plazas_totales,
        ya_reservado: yaReservado
      };
    });

    res.json(resultado);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /horarios/profesor/:id
router.get('/profesor/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const horarios = await Horario.findAll({
      include: [
        {
          model: Clase,
          where: { id_profesor: id },
          include: [
            {
              model: Usuario,
              as: 'profesor',
              attributes: ['id_usuario', 'nombre', 'apellidos']
            }
          ]
        },
        {
          model: Reserva,
          where: { estado: 'activa' },
          required: false,
          include: [
            {
              model: Usuario,
              attributes: ['id_usuario', 'nombre', 'apellidos']
            }
          ]
        }
      ],
      order: [['fecha', 'ASC'], ['hora_inicio', 'ASC']]
    });

    const resultado = horarios.map(h => ({
      ...h.toJSON(),
      alumnos: h.Reservas.map(r => r.Usuario),
      plazas_ocupadas: h.Reservas.length,
      plazas_totales: h.Clase.capacidad_maxima
    }));

    res.json(resultado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /horarios/:id/cerrar
router.patch('/:id/cerrar', async (req, res) => {
  try {
    const horario = await Horario.findByPk(req.params.id);
    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    horario.reservas_abiertas = false;
    await horario.save();

    res.json({ mensaje: 'Reservas cerradas' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /horarios/:id/abrir
router.patch('/:id/abrir', async (req, res) => {
  try {
    const horario = await Horario.findByPk(req.params.id);
    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    horario.reservas_abiertas = true;
    await horario.save();

    res.json({ mensaje: 'Reservas abiertas' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =========================
// GET /horarios/:id/alumnos
// =========================
router.get('/:id/alumnos', async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      where: {
        id_horario: req.params.id,
        estado: 'activa'
      },
      include: [
        {
          model: Usuario,
          attributes: ['id_usuario', 'nombre', 'apellidos', 'email']
        }
      ]
    });

    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
