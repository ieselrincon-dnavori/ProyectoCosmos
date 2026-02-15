const express = require('express');
const router = express.Router();

const { Horario, Clase, Usuario, Reserva } = require('../database');
const bonoActivo = require('../middleware/bonoActivo');
const roles = require('../middleware/roles');


/* =====================================================
   ADMIN — PANEL GLOBAL DE CLASES
   GET /horarios/admin
===================================================== */
router.get('/admin', roles('admin'), async (req, res) => {
  try {

    const horarios = await Horario.findAll({

      include: [
        {
          model: Clase,
          attributes: ['nombre_clase', 'capacidad_maxima'],
          include: [
            {
              model: Usuario,
              as: 'profesor',
              attributes: ['nombre', 'apellidos']
            }
          ]
        },
        {
          model: Reserva,
          where: { estado: 'activa' },
          required: false
        }
      ],

      order: [['fecha', 'ASC'], ['hora_inicio', 'ASC']]
    });

    const resultado = horarios.map(h => {

      const inscritos = h.Reservas?.length || 0;
      const capacidad = h.Clase.capacidad_maxima;
      const libres = capacidad - inscritos;

      let estado = 'disponible';

      if (libres <= 0) estado = 'llena';
      else if (libres <= 3) estado = 'casi llena';

      return {
        id_horario: h.id_horario,
        clase: h.Clase.nombre_clase,
        profesor: `${h.Clase.profesor.nombre} ${h.Clase.profesor.apellidos}`,
        fecha: h.fecha,
        hora_inicio: h.hora_inicio,
        capacidad,
        inscritos,
        libres,
        estado,
        reservas_abiertas: h.reservas_abiertas
      };

    });

    res.json(resultado);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: err.message });

  }
});


/* =====================================================
   HORARIOS DE PROFESOR
   GET /horarios/profesor/:id
===================================================== */
router.get('/profesor/:id', async (req, res) => {
  try {

    const horarios = await Horario.findAll({
      include: [
        {
          model: Clase,
          where: { id_profesor: req.params.id },
          include: [
            {
              model: Usuario,
              as: 'profesor',
              attributes: ['id_usuario', 'nombre', 'apellidos']
            }
          ]
        },
        {
          model: Reserva,
          where: { estado: 'activa' },
          required: false,
          include: [
            {
              model: Usuario,
              attributes: ['id_usuario', 'nombre', 'apellidos']
            }
          ]
        }
      ],
      order: [['fecha', 'ASC'], ['hora_inicio', 'ASC']]
    });

    const resultado = horarios.map(h => ({
      ...h.toJSON(),
      plazas_ocupadas: h.Reservas?.length || 0,
      plazas_totales: h.Clase.capacidad_maxima
    }));

    res.json(resultado);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: err.message });

  }
});


/* =====================================================
   ALUMNOS DE UN HORARIO
   GET /horarios/:id/alumnos
===================================================== */
router.get('/:id/alumnos', async (req, res) => {
  try {

    const reservas = await Reserva.findAll({
      where: {
        id_horario: req.params.id,
        estado: 'activa'
      },
      include: [
        {
          model: Usuario,
          attributes: ['id_usuario', 'nombre', 'apellidos', 'email']
        }
      ]
    });

    res.json(reservas);

  } catch (err) {

    res.status(500).json({ error: err.message });

  }
});


/* =====================================================
   CLIENTES / GENERAL
   GET /horarios
===================================================== */
router.get('/', async (req, res) => {

  try {

    // 🔥 SOLO clientes necesitan bono
    if (req.user.rol === 'cliente') {
      return bonoActivo(req, res, async () => {
        await obtenerHorarios(req, res);
      });
    }

    await obtenerHorarios(req, res);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: err.message });

  }

});


async function obtenerHorarios(req, res) {

  const id_cliente = req.query.id_cliente;

  const horarios = await Horario.findAll({
    include: [
      {
        model: Clase,
        include: [
          {
            model: Usuario,
            as: 'profesor',
            attributes: ['id_usuario', 'nombre', 'apellidos']
          }
        ]
      },
      {
        model: Reserva,
        include: [
          {
            model: Usuario,
            attributes: ['id_usuario', 'nombre', 'apellidos']
          }
        ]
      }
    ],
    order: [['fecha', 'ASC'], ['hora_inicio', 'ASC']]
  });

  const resultado = horarios.map(h => {

    const reservas = h.Reservas || [];

    const yaReservado = id_cliente
      ? reservas.some(r => r.id_cliente == id_cliente)
      : false;

    const plazas_ocupadas = reservas.length;
    const plazas_totales = h.Clase.capacidad_maxima;

    return {
      ...h.toJSON(),
      plazas_ocupadas,
      plazas_totales,
      plazas_disponibles: plazas_ocupadas < plazas_totales,
      ya_reservado: yaReservado
    };

  });

  res.json(resultado);
}


/* =====================================================
   CERRAR RESERVAS
   PATCH /horarios/:id/cerrar
===================================================== */
router.patch('/:id/cerrar', roles('admin'), async (req, res) => {
  try {

    const horario = await Horario.findByPk(req.params.id);

    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    horario.reservas_abiertas = false;
    await horario.save();

    res.json({ mensaje: 'Reservas cerradas' });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }
});


/* =====================================================
   ABRIR RESERVAS
===================================================== */
router.patch('/:id/abrir', roles('admin'), async (req, res) => {
  try {

    const horario = await Horario.findByPk(req.params.id);

    if (!horario) {
      return res.status(404).json({ error: 'Horario no encontrado' });
    }

    horario.reservas_abiertas = true;
    await horario.save();

    res.json({ mensaje: 'Reservas abiertas' });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }
});


module.exports = router;
