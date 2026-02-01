const express = require('express');
const router = express.Router();
const { Reserva, Horario, Clase, Usuario } = require('../database');


/* =========================
   GET /reservas
========================= */
router.get('/', async (req, res) => {
  try {
    const reservas = await Reserva.findAll();
    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET /reservas/cliente/:id
========================= */
router.get('/cliente/:id', async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      where: { id_cliente: req.params.id },
      include: [
        {
          model: Horario,
          include: [
            {
              model: Clase,
              include: [
                {
                  model: Usuario,
                  as: 'profesor',
                  attributes: ['nombre', 'apellidos']
                }
              ]
            }
          ]
        }
      ],
      order: [['fecha_reserva', 'DESC']]
    });

    res.json(reservas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   POST /reservas
========================= */


router.post('/', async (req, res) => {
  try {
    const { id_cliente, id_horario } = req.body;

    // 1️⃣ Buscar horario + clase
    const horario = await Horario.findByPk(id_horario, {
      include: Clase
      
    });


if (!usuario || !usuario.activo) {
  return res.status(403).json({
    error: 'Usuario desactivado'
  });
}

    if (!horario) {
      return res.status(404).json({ error: 'Horario no existe' });
    }

    // 2️⃣ Evitar duplicados
    const existente = await Reserva.findOne({
      where: {
        id_cliente,
        id_horario,
        estado: 'activa'
      }
    });

    if (existente) {
      return res.status(400).json({
        error: 'Ya tienes una reserva activa en este horario'
      });
    }

    // 3️⃣ Comprobar capacidad
    const reservasActivas = await Reserva.count({
      where: {
        id_horario,
        estado: 'activa'
      }
    });

    if (reservasActivas >= horario.Clase.capacidad_maxima) {
      return res.status(400).json({
        error: 'No hay plazas disponibles'
      });
    }

    if (!horario.reservas_abiertas) {
  return res.status(400).json({
    error: 'Las reservas están cerradas para este horario'
  });
}

    // 4️⃣ Crear reserva
    const reserva = await Reserva.create({
      id_cliente,
      id_horario,
      estado: 'activa'
    });

    res.status(201).json(reserva);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la reserva' });
  }
});

/* =========================
   PATCH /reservas/:id/cancelar
========================= */
router.patch('/:id/cancelar', async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    if (reserva.estado !== 'activa') {
      return res.status(400).json({ error: 'La reserva no está activa' });
    }

    reserva.estado = 'cancelada';
    await reserva.save();

    res.json(reserva);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /reservas/:id/forzar-cancelacion
router.patch('/:id/forzar-cancelacion', async (req, res) => {
  try {
    const reserva = await Reserva.findByPk(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }

    reserva.estado = 'cancelada';
    await reserva.save();

    res.json({ mensaje: 'Reserva cancelada por el profesor' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
