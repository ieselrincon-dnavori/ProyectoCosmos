const express = require('express');
const router = express.Router();
const { Clase, Usuario, Horario, Reserva, sequelize } = require('../database');
const roles = require('../middleware/roles');

router.use(roles('admin'));

/* =========================
   GET PROFESORES
   GET /admin/profesores
========================= */
router.get('/profesores', async (req, res) => {
  try {
    const profesores = await Usuario.findAll({
      where: { rol: 'profesor', activo: true },
      attributes: ['id_usuario', 'nombre', 'apellidos']
    });

    res.json(profesores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   GET CLASES ADMIN
   GET /admin/clases
========================= */
router.get('/clases', async (req, res) => {
  try {
    const horarios = await Horario.findAll({
      include: [
        {
          model: Clase,
          required: true,
          attributes: ['nombre_clase', 'capacidad_maxima'],
          include: [{
            model: Usuario,
            as: 'profesor',
            attributes: ['nombre', 'apellidos']
          }]
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
      const capacidad = h.Clase?.capacidad_maxima || 0;
      const libres = capacidad - inscritos;

      let estado = 'disponible';
      if (libres <= 0) estado = 'llena';
      else if (libres <= 3) estado = 'casi llena';

      return {
        id_horario: h.id_horario,
        clase: h.Clase?.nombre_clase,
        profesor: h.Clase?.profesor
          ? `${h.Clase.profesor.nombre} ${h.Clase.profesor.apellidos}`
          : 'Sin asignar',
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

/* =========================
   CREAR CLASE
   POST /admin/clases
========================= */
router.post('/clases', async (req, res) => {
  const t = await sequelize.transaction();

  try {
    let {
      nombre_clase,
      id_profesor,
      capacidad_maxima,
      fecha,
      hora_inicio,
      reservas_abiertas
    } = req.body;

    if (!nombre_clase || !id_profesor || !capacidad_maxima || !fecha || !hora_inicio) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // 🔥 CORRECCIÓN FORMATO HORA
    if (hora_inicio.includes('T')) {
      const dateObj = new Date(hora_inicio);
      hora_inicio = dateObj.toTimeString().slice(0,5);
    }

    // 🔥 CORRECCIÓN FORMATO FECHA
    if (fecha.includes('T')) {
      fecha = fecha.split('T')[0];
    }

    const profesor = await Usuario.findByPk(id_profesor);
    if (!profesor || profesor.rol !== 'profesor') {
      return res.status(404).json({ error: 'Profesor no válido' });
    }

    const clase = await Clase.create({
      nombre_clase,
      id_profesor,
      capacidad_maxima
    }, { transaction: t });

    const [horas, minutos] = hora_inicio.split(':');
    const horaFinDate = new Date();
    horaFinDate.setHours(parseInt(horas) + 1, parseInt(minutos));
    const hora_fin = horaFinDate.toTimeString().slice(0, 5);

    await Horario.create({
      id_clase: clase.id_clase,
      fecha,
      hora_inicio,
      hora_fin,
      reservas_abiertas: reservas_abiertas ?? true
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      mensaje: 'Clase y horario creados correctamente'
    });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
