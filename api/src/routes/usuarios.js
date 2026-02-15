const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');

const { Usuario, Pago, BonoPlan } = require("../database");
const { Op } = require('sequelize');

const roles = require('../middleware/roles');


/* =========================
   GET /usuarios/admin
   SOLO ADMIN
========================= */
router.get("/admin", roles('admin'), async (req, res) => {
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
      order: [['id_usuario', 'ASC']]
    });

    res.json(usuarios);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   GET usuarios por rol
   SOLO ADMIN
========================= */
router.get("/rol/:rol", roles('admin'), async (req, res) => {
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
   ADMIN - Crear usuario
========================= */
router.post('/admin', roles('admin'), async (req, res) => {

  try {

    const {
      nombre,
      apellidos,
      email,
      password,
      telefono,
      rol
    } = req.body;

    const existe = await Usuario.findOne({ where: { email } });

    if (existe) {
      return res.status(400).json({
        error: 'El email ya está registrado'
      });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const usuario = await Usuario.create({
      nombre,
      apellidos,
      email,
      password_hash,
      telefono,
      rol,
      activo: true
    });

    const userSafe = usuario.toJSON();
    delete userSafe.password_hash;

    res.status(201).json(userSafe);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   ADMIN - Toggle activo
========================= */
router.patch('/:id/toggle-activo', roles('admin'), async (req, res) => {

  try {

    const usuario = await Usuario.findByPk(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    usuario.activo = !usuario.activo;
    await usuario.save();

    res.json({
      id: usuario.id_usuario,
      activo: usuario.activo
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   GET BONO (SIEMPRE AL FINAL)
   Anti-IDOR
========================= */
router.get('/:id/bono', async (req, res) => {

  try {

    if (
      req.user.rol !== 'admin' &&
      req.user.id !== Number(req.params.id)
    ) {
      return res.status(403).json({
        error: 'No autorizado'
      });
    }

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

    if (!bono) return res.json(null);

    res.json({
      tipo: bono.BonoPlan.nombre_bono,
      sesiones_restantes: bono.sesiones_restantes,
      fecha_vencimiento: bono.fecha_vencimiento
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
