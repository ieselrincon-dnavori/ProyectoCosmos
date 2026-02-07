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

    const pagoActivo = await Pago.findOne({
      where: {
        id_cliente: idCliente,
        fecha_vencimiento: {
          [Op.gt]: hoy
        }
      },
      include: [BonoPlan]
    });

    if (!pagoActivo) {
      return res.status(403).json({
        error: 'Necesitas un bono activo para reservar'
      });
    }

    // opcional — dejamos info útil
    req.bono = pagoActivo;

    next();

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};
