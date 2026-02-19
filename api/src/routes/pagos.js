const express = require('express');
const router = express.Router();

const { Pago, BonoPlan, Usuario } = require('../database');
const { Op } = require('sequelize');

const roles = require('../middleware/roles');


/* =========================
   GET TODOS LOS PAGOS
   SOLO ADMIN
========================= */
router.get('/', roles('admin'), async (req, res) => {
  try {

    const pagos = await Pago.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['id_usuario', 'nombre', 'apellidos', 'email']
        },
        {
          model: BonoPlan,
          attributes: ['nombre_bono', 'precio']
        }
      ],
      order: [['fecha_pago', 'DESC']]
    });

    res.json(pagos);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   GET PAGOS DE UN CLIENTE
   Anti-IDOR
========================= */
router.get('/cliente/:id', async (req, res) => {
  try {

    if (
      req.user.rol !== 'admin' &&
      req.user.id !== Number(req.params.id)
    ) {
      return res.status(403).json({
        error: 'No autorizado'
      });
    }

    const pagos = await Pago.findAll({
      where: { id_cliente: req.params.id },
      include: [BonoPlan],
      order: [['fecha_pago', 'DESC']]
    });

    res.json(pagos);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   BONO ACTIVO
========================= */

router.get('/cliente/:id/activo', async (req, res) => {
  try {

    if (
      req.user.rol !== 'admin' &&
      req.user.id !== Number(req.params.id)
    ) {
      return res.status(403).json({
        error: 'No autorizado'
      });
    }

    const hoy = new Date();
    const id = req.params.id;

    let pago = await Pago.findOne({
      where: {
        id_cliente: id,
        sesiones_restantes: { [Op.gt]: 0 }
      },
      include: [BonoPlan],
      order: [['fecha_pago', 'ASC']]
    });

    if (!pago) {

      pago = await Pago.findOne({
        where: {
          id_cliente: id,
          fecha_vencimiento: { [Op.gt]: hoy }
        },
        include: [BonoPlan],
        order: [['fecha_vencimiento', 'ASC']]
      });

    }

    if (!pago) {
      return res.json(null); // 🔥 MUY IMPORTANTE
    }

    res.json({
      id_pago: pago.id_pago,
      nombre_bono: pago.BonoPlan.nombre_bono,
      sesiones_restantes: pago.sesiones_restantes,
      fecha_vencimiento: pago.fecha_vencimiento // 🔥 nombre correcto
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   CREAR PAGO
   SOLO ADMIN
========================= */
router.post('/', roles('admin'), async (req, res) => {
  try {

    const { id_cliente, id_bono, metodo_pago } = req.body;

    const bono = await BonoPlan.findByPk(id_bono);

    if (!bono) {
      return res.status(404).json({
        error: 'Bono no encontrado'
      });
    }

    let fecha_vencimiento = null;
    let sesiones_restantes = null;

    if (bono.duracion_dias) {
      fecha_vencimiento = new Date();
      fecha_vencimiento.setDate(
        fecha_vencimiento.getDate() + bono.duracion_dias
      );
    }

    if (bono.num_sesiones) {
      sesiones_restantes = bono.num_sesiones;
    }

    const pago = await Pago.create({
      id_cliente,
      id_bono,
      monto: bono.precio,
      metodo_pago,
      fecha_vencimiento,
      sesiones_restantes
    });

    res.status(201).json(pago);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
