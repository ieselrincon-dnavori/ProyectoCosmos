const { Pago, BonoPlan } = require('../database');
const { Op } = require('sequelize');

module.exports = async function bonoActivo(req, res, next) {

  try {

    // 🔥 buscamos el id en TODOS los sitios posibles
    const idCliente =
      req.body.id_cliente ||
      req.query.id_cliente ||
      req.params.id_cliente ||
      req.headers['x-user-id'];

    if (!idCliente) {
      return res.status(400).json({
        error: 'No se pudo identificar al usuario'
      });
    }

    const hoy = new Date();

    // ✅ BONO DE SESIONES
    let pago = await Pago.findOne({
      where: {
        id_cliente: idCliente,
        sesiones_restantes: {
          [Op.gt]: 0
        }
      },
      include: [BonoPlan],
      order: [['fecha_pago', 'ASC']]
    });

    // ✅ BONO ILIMITADO
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

    req.bono = pago;

    next();

  } catch (err) {

    console.error("🔥 ERROR middleware bonoActivo:", err);

    res.status(500).json({
      error: 'Error verificando bono'
    });

  }
};
