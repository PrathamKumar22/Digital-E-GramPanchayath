const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');

// GET all notices (This is what Home.jsx calls)
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// POST a new notice (This is what Admin Panel calls)
router.post('/', async (req, res) => {
  try {
    const { title, content, type } = req.body;
    const newNotice = new Notice({ title, content, type });
    await newNotice.save();
    res.json(newNotice);
  } catch (err) {
    res.status(500).json({ msg: "Failed to add notice" });
  }
});

// DELETE a notice
router.delete('/:id', async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ msg: "Notice deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
});

module.exports = router;