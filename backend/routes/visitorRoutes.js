const express = require('express');
const router = express.Router();
const jsonDb = require('../utils/jsonDb');
const auth = require('../middleware/authMiddleware');

// GET all visitor stats - Protected
router.get('/stats', auth, (req, res) => {
  try {
    const visitors = jsonDb.get('visitors') || { count: 0 };
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST increment visitor count - Public
router.post('/count', (req, res) => {
  try {
    const newCount = jsonDb.incrementVisitor();
    res.json({ count: newCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
