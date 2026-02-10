const { Pago, BonoPlan } = require('../database');
const { Op } = require('sequelize');

module.exports = async function bonoActivo(req, res, next) {

  try {

    const idCliente = req.body.id_cliente;

    if (!idCliente) {
      return res.status(400).json({
        error: 'Falta id_cliente'
      });
    }

    const hoy = new Date();

    // 🔥 1️⃣ Buscar bonos de SESIONES primero
    let pago = await Pago.findOne({
      where: {
        id_cliente: idCliente,
        sesiones_restantes: {
          [Op.gt]: 0
        }
      },
      include: [BonoPlan],
      order: [['fecha_pago', 'ASC']] // consume el más antiguo
    });

    // 🔥 2️⃣ Si no hay sesiones → buscar ilimitado activo
    if (!pago) {

      pago = await Pago.findOne({
        where: {
          id_cliente: idCliente,
          fecha_vencimiento: {
            [Op.gt]: hoy
          }
        },
        include: [BonoPlan],
        order: [['fecha_vencimiento', 'ASC']]
      });

    }

    if (!pago) {
      return res.status(403).json({
        error: 'Necesitas un bono activo'
      });
    }

    // 👉 lo guardamos para el router de reservas
    req.bono = pago;

    next();

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};
