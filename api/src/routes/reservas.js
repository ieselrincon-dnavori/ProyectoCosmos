const express = require('express');
const router = express.Router();

const {
  Reserva,
  Horario,
  Clase,
  Usuario,
  Pago,
  sequelize
} = require('../database');

const bonoActivo = require('../middleware/bonoActivo');


/* =========================
   GET /reservas
========================= */
router.get('/', async (req, res) => {
  try {

    const reservas = await Reserva.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['id_usuario', 'nombre', 'apellidos']
        },
        {
          model: Horario,
          include: [
            {
              model: Clase,
              attributes: ['nombre_clase']
            }
          ]
        }
      ]
    });

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

router.post('/', bonoActivo, async (req, res) => {

  const t = await sequelize.transaction();

  try {

    const { id_cliente, id_horario } = req.body;

    // ✅ Validación básica
    if (!id_cliente || !id_horario) {
      await t.rollback();
      return res.status(400).json({
        error: 'Faltan datos para la reserva'
      });
    }

    // ✅ Bloquear SOLO el horario
    const horario = await Horario.findByPk(id_horario, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!horario) {
      await t.rollback();
      return res.status(404).json({
        error: 'Horario no existe'
      });
    }

    if (!horario.reservas_abiertas) {
      await t.rollback();
      return res.status(400).json({
        error: 'Las reservas están cerradas'
      });
    }

    // ✅ Obtener clase SIN JOIN peligroso
    const clase = await horario.getClase({ transaction: t });

    if (!clase) {
      await t.rollback();
      return res.status(404).json({
        error: 'Clase no encontrada'
      });
    }

    // ✅ Evitar duplicados
    const existente = await Reserva.findOne({
      where: {
        id_cliente,
        id_horario,
        estado: 'activa'
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (existente) {
      await t.rollback();
      return res.status(400).json({
        error: 'Ya tienes una reserva activa'
      });
    }

    // ✅ Contar plazas bajo lock
    const reservasActivas = await Reserva.count({
      where: {
        id_horario,
        estado: 'activa'
      },
      transaction: t
    });

    if (reservasActivas >= clase.capacidad_maxima) {
      await t.rollback();
      return res.status(400).json({
        error: 'No hay plazas disponibles'
      });
    }

    // ✅ Crear reserva
    const reserva = await Reserva.create({
      id_cliente,
      id_horario,
      estado: 'activa'
    }, { transaction: t });


    // ✅ Consumir sesión SOLO si hay bono
    if (req.bono && req.bono.sesiones_restantes !== null) {

      const pago = await Pago.findByPk(req.bono.id_pago, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      if (!pago) {
        await t.rollback();
        return res.status(400).json({
          error: 'Bono no válido'
        });
      }

      if (pago.sesiones_restantes <= 0) {
        await t.rollback();
        return res.status(400).json({
          error: 'No te quedan sesiones'
        });
      }

      pago.sesiones_restantes -= 1;
      await pago.save({ transaction: t });
    }

    await t.commit();

    res.status(201).json(reserva);

  } catch (err) {

    await t.rollback();

    console.error("🔥 ERROR CREANDO RESERVA:");
    console.error(err);

    res.status(500).json({
      error: 'Error al crear la reserva'
    });
  }
});



/* =========================
   CANCELAR RESERVA
========================= */

router.patch('/:id/cancelar', async (req, res) => {

  const t = await sequelize.transaction();

  try {

    const reserva = await Reserva.findByPk(req.params.id, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!reserva) {
      await t.rollback();
      return res.status(404).json({
        error: 'Reserva no encontrada'
      });
    }

    if (reserva.estado !== 'activa') {
      await t.rollback();
      return res.status(400).json({
        error: 'La reserva no está activa'
      });
    }

    reserva.estado = 'cancelada';
    await reserva.save({ transaction: t });

    // devolver sesión si aplica
    const pago = await Pago.findOne({
      where: {
        id_cliente: reserva.id_cliente,
        sesiones_restantes: {
          [require('sequelize').Op.ne]: null
        }
      },
      order: [['fecha_pago', 'DESC']],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (pago) {
      pago.sesiones_restantes += 1;
      await pago.save({ transaction: t });
    }

    await t.commit();

    res.json(reserva);

  } catch (err) {

    await t.rollback();
    res.status(500).json({ error: err.message });
  }
});



/* =========================
   CANCELACIÓN PROFESOR
========================= */

router.patch('/:id/forzar-cancelacion', async (req, res) => {

  try {

    const reserva = await Reserva.findByPk(req.params.id);

    if (!reserva) {
      return res.status(404).json({
        error: 'Reserva no encontrada'
      });
    }

    reserva.estado = 'cancelada';
    await reserva.save();

    res.json({
      mensaje: 'Reserva cancelada por el profesor'
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});

module.exports = router;
