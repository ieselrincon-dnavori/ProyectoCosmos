const express = require('express');
const router = express.Router();
const { BonoPlan } = require('../database');


/* =========================
   GET /bonos
========================= */
router.get('/', async (req, res) => {
  try {

    const bonos = await BonoPlan.findAll({
      order: [['precio', 'ASC']]
    });

    res.json(bonos);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   POST /bonos
   (admin)
========================= */
router.post('/', async (req, res) => {
  try {

    const bono = await BonoPlan.create(req.body);

    res.status(201).json(bono);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   PUT /bonos/:id
========================= */
router.put('/:id', async (req, res) => {
  try {

    const bono = await BonoPlan.findByPk(req.params.id);

    if (!bono) {
      return res.status(404).json({
        error: 'Bono no encontrado'
      });
    }

    await bono.update(req.body);

    res.json(bono);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   DELETE /bonos/:id
========================= */
router.delete('/:id', async (req, res) => {
  try {

    const bono = await BonoPlan.findByPk(req.params.id);

    if (!bono) {
      return res.status(404).json({
        error: 'Bono no encontrado'
      });
    }

    await bono.destroy();

    res.json({
      mensaje: 'Bono eliminado'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
