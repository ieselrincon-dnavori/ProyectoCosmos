const express = require('express');
const router = express.Router();

const { Usuario, Pago, Horario, Reserva, Clase } = require('../database');
const roles = require('../middleware/roles');

const { Op, fn, col, literal } = require('sequelize');

// 🔐 todo admin
router.use(roles('admin'));


/* =====================================================
   ADMIN DASHBOARD PRO
===================================================== */

router.get('/dashboard', async (req, res) => {

  try {

    /* ===============================
       CLIENTES ACTIVOS
    =============================== */

    const clientesActivos = await Usuario.count({
      where: {
        rol: 'cliente',
        activo: true
      }
    });


    /* ===============================
       INGRESOS MES ACTUAL
    =============================== */

    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0,0,0,0);

    const ingresosMes = await Pago.sum('monto', {
      where: {
        fecha_pago: {
          [Op.gte]: inicioMes
        }
      }
    });


    /* ===============================
       CLASES HOY
    =============================== */

    const hoy = new Date().toISOString().split('T')[0];

    const clasesHoy = await Horario.count({
      where: { fecha: hoy }
    });


    /* ===============================
       OCUPACIÓN MEDIA
    =============================== */

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
      totalCapacidad += h.Clase.capacidad_maxima;
      totalReservas += h.Reservas?.length || 0;
    });

    const ocupacionMedia = totalCapacidad
      ? Math.round((totalReservas / totalCapacidad) * 100)
      : 0;


    /* =====================================================
       🔥 INGRESOS ÚLTIMOS 6 MESES (para gráfica)
    ===================================================== */

    const seisMeses = new Date();
    seisMeses.setMonth(seisMeses.getMonth() - 5);
    seisMeses.setDate(1);

    const ingresosPorMes = await Pago.findAll({

      attributes: [
        [fn('date_trunc', 'month', col('fecha_pago')), 'mes'],
        [fn('sum', col('monto')), 'total']
      ],

      where: {
        fecha_pago: {
          [Op.gte]: seisMeses
        }
      },

      group: [fn('date_trunc', 'month', col('fecha_pago'))],
      order: [[fn('date_trunc', 'month', col('fecha_pago')), 'ASC']]
    });


    /* =====================================================
       🔥 TOP CLASES (más llenas)
    ===================================================== */

    const topClases = await Horario.findAll({

      attributes: [
        'id_horario',
        'fecha',
        [col('Clase.nombre_clase'), 'clase'],
        [fn('COUNT', col('Reservas.id_reserva')), 'inscritos'],
        [col('Clase.capacidad_maxima'), 'capacidad']
      ],

      include: [
        {
          model: Clase,
          attributes: []
        },
        {
          model: Reserva,
          attributes: [],
          where: { estado: 'activa' },
          required: false
        }
      ],

      group: [
        'Horario.id_horario',
        'Clase.id_clase'
      ],

      order: [
        [literal('inscritos'), 'DESC']
      ],

      limit: 5
    });


    /* =====================================================
       🔥 CLIENTES NUEVOS ESTE MES
    ===================================================== */

    const clientesNuevos = await Usuario.count({
      where: {
        rol: 'cliente',
        createdAt: {
          [Op.gte]: inicioMes
        }
      }
    });


    res.json({

      kpis: {
        clientes_activos: clientesActivos,
        ingresos_mes: ingresosMes || 0,
        clases_hoy: clasesHoy,
        ocupacion_media: ocupacionMedia,
        clientes_nuevos: clientesNuevos
      },

      graficas: {
        ingresos_6_meses: ingresosPorMes,
        top_clases: topClases
      }

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;
