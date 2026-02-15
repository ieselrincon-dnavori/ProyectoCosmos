const express = require('express');
const router = express.Router();

const { Usuario, Pago, Horario, Reserva, Clase } = require('../database');
const roles = require('../middleware/roles');

const { Op, fn, col } = require('sequelize');


/* =========================
   ADMIN DASHBOARD
========================= */
router.get('/dashboard', roles('admin'), async (req, res) => {

  try {

    /* =====================
       CLIENTES ACTIVOS
    ===================== */

    const clientesActivos = await Usuario.count({
      where: {
        rol: 'cliente',
        activo: true
      }
    });


    /* =====================
       INGRESOS DEL MES
    ===================== */

    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0,0,0,0);

    const ingresos = await Pago.sum('monto', {
      where: {
        fecha_pago: {
          [Op.gte]: inicioMes
        }
      }
    });


    /* =====================
       CLASES HOY
    ===================== */

    const hoy = new Date().toISOString().split('T')[0];

    const clasesHoy = await Horario.count({
      where: { fecha: hoy }
    });


    /* =====================
       OCUPACIÓN MEDIA
    ===================== */

    const horarios = await Horario.findAll({
      include: [
        {
          model: Clase,
          attributes: ['capacidad_maxima']
        },
        {
          model: Reserva,
          where: { estado: 'activa' },
          required: false
        }
      ]
    });

    let totalCapacidad = 0;
    let totalReservas = 0;

    horarios.forEach(h => {

      const capacidad = h.Clase.capacidad_maxima;
      const reservas = h.Reservas?.length || 0;

      totalCapacidad += capacidad;
      totalReservas += reservas;

    });

    const ocupacionMedia = totalCapacidad
      ? Math.round((totalReservas / totalCapacidad) * 100)
      : 0;


    res.json({

      clientes_activos: clientesActivos,
      ingresos_mes: ingresos || 0,
      clases_hoy: clasesHoy,
      ocupacion_media: ocupacionMedia

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;
