const express = require("express");
const router = express.Router();
const { Usuario, Pago, BonoPlan } = require("../database");
const { Op } = require('sequelize');


/* =========================
   GET /usuarios
========================= */
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
  where: { activo: true },
  attributes: { exclude: ['password_hash'] }
});

    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   GET /usuarios/rol/:rol
========================= */
router.get("/rol/:rol", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      where: { rol: req.params.rol },
      attributes: { exclude: ['password_hash'] }
    });

    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   POST /usuarios
========================= */
router.post("/", async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);

    res.status(201).json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   PUT /usuarios/:id
========================= */
router.put("/:id", async (req, res) => {
  try {

    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await usuario.update(req.body);

    res.json(usuario);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   DELETE /usuarios/:id
========================= */
router.delete("/:id", async (req, res) => {
  try {

    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    usuario.activo = false;
    await usuario.save();

    res.json({ mensaje: "Usuario desactivado" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN - Crear usuario
router.post('/admin', async (req, res) => {
  try {

    const {
      nombre,
      apellidos,
      email,
      password_hash,
      telefono,
      rol
    } = req.body;

    const existe = await Usuario.findOne({ where: { email } });

    if (existe) {
      return res.status(400).json({
        error: 'El email ya está registrado'
      });
    }

    const usuario = await Usuario.create({
      nombre,
      apellidos,
      email,
      password_hash,
      telefono,
      rol,
      activo: true
    });

    res.status(201).json(usuario);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ADMIN - Desactivar usuario
router.patch('/:id/desactivar', async (req, res) => {
  try {

    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    usuario.activo = false;
    await usuario.save();

    res.json({
      mensaje: 'Usuario desactivado'
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

router.get('/admin', async (req, res) => {
  try {

    const usuarios = await Usuario.findAll({
      attributes: [
        'id_usuario',
        'nombre',
        'apellidos',
        'email',
        'rol',
        'activo',
        'fecha_registro'
      ],
      order: [['id_usuario', 'DESC']]
    });

    res.json(usuarios);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/toggle-activo', async (req, res) => {
  try {

    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    usuario.activo = !usuario.activo;

    await usuario.save();

    res.json(usuario);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {

    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Soft delete profesional
    usuario.activo = false;
    await usuario.save();

    res.json({ mensaje: 'Usuario desactivado' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }




});

router.get('/:id/bono', async (req, res) => {

  try {

    const hoy = new Date();

    const bono = await Pago.findOne({

      where: {
        id_cliente: req.params.id,
        [Op.or]: [
          { fecha_vencimiento: { [Op.gt]: hoy } },
          { sesiones_restantes: { [Op.gt]: 0 } }
        ]
      },

      include: [BonoPlan],
      order: [['fecha_pago', 'DESC']]

    });

    if (!bono) {
      return res.json(null);
    }

    res.json({
      tipo: bono.BonoPlan.nombre_bono,
      sesiones_restantes: bono.sesiones_restantes,
      fecha_vencimiento: bono.fecha_vencimiento
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});
module.exports = router;
