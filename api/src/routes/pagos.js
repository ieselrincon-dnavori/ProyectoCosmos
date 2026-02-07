const express = require('express');
const router = express.Router();
const { Pago, BonoPlan, Usuario } = require('../database');


/* =========================
   GET /pagos
   (admin)
========================= */
router.get('/', async (req, res) => {
  try {

    const pagos = await Pago.findAll({
      include: [
        {
          model: Usuario,
          attributes: ['id_usuario', 'nombre', 'email']
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
   GET pagos de un cliente
========================= */
router.get('/cliente/:id', async (req, res) => {
  try {

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
   CREAR PAGO
========================= */
router.post('/', async (req, res) => {
  try {

    const { id_cliente, id_bono, metodo_pago } = req.body;

    // buscar bono
    const bono = await BonoPlan.findByPk(id_bono);

    if (!bono) {
      return res.status(404).json({
        error: 'Bono no encontrado'
      });
    }

    let fecha_vencimiento = null;

    if (bono.duracion_dias) {

      fecha_vencimiento = new Date();
      fecha_vencimiento.setDate(
        fecha_vencimiento.getDate() + bono.duracion_dias
      );
    }

    const pago = await Pago.create({
      id_cliente,
      id_bono,
      monto: bono.precio,
      metodo_pago,
      fecha_vencimiento
    });

    res.status(201).json(pago);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
