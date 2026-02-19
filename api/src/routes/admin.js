const express = require('express');
const router = express.Router();

const { sequelize, Usuario, Pago, Horario } = require('../database');
const roles = require('../middleware/roles');

const { Op, QueryTypes, fn, col } = require('sequelize');

router.use(roles('admin'));

/* =========================
   DASHBOARD
========================= */
router.use(roles('admin'));

/* =========================
   DASHBOARD
========================= */
router.get('/dashboard', async (req, res) => {
  try {

    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0,0,0,0);

    const hoy = new Date().toISOString().split('T')[0];

    const [
      clientesActivos,
      ingresosMes,
      clasesHoy,
      ocupacionResult
    ] = await Promise.all([

      Usuario.count({
        where: { rol: 'cliente', activo: true }
      }),

      Pago.sum('monto', {
        where: {
          fecha_pago: { [Op.gte]: inicioMes }
        }
      }),

      Horario.count({
        where: { fecha: hoy }
      }),

      sequelize.query(`
        SELECT COALESCE(
          ROUND(
            (COUNT(r.id_reserva)::decimal /
            NULLIF(SUM(c.capacidad_maxima),0)) * 100
          ),0
        ) as ocupacion
        FROM horario h
        JOIN clase c ON h.id_clase = c.id_clase
        LEFT JOIN reserva r
          ON r.id_horario = h.id_horario
          AND r.estado = 'activa'
        WHERE h.fecha = :hoy
      `, {
        replacements: { hoy },
        type: QueryTypes.SELECT
      })

    ]);

    res.json({
      clientes_activos: clientesActivos,
      ingresos_mes: Number(ingresosMes || 0),
      clases_hoy: clasesHoy,
      ocupacion_media: Number(ocupacionResult[0].ocupacion)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   DASHBOARD CHART
========================= */
router.get('/dashboard-chart', async (req, res) => {
  try {

    const ingresos = await Pago.findAll({
      attributes: [
        [fn('DATE_TRUNC', 'month', col('fecha_pago')), 'mes'],
        [fn('SUM', col('monto')), 'total']
      ],
      group: ['mes'],
      order: [['mes', 'ASC']]
    });

    res.json(ingresos);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;