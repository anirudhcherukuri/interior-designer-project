const express = require('express');
const router = express.Router();
const jsonDb = require('../utils/jsonDb');
const auth = require('../middleware/authMiddleware');

// GET all enquiries - Protected
router.get('/', auth, (req, res) => {
  try {
    const enquiries = jsonDb.get('enquiries') || [];
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create enquiry - Public (Sanitized by middleware and explicit destructuring here as well)
router.post('/', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    
    // Defensive coding (IDOR defense): Manually mapping inputs to the store
    const newEnquiry = jsonDb.add('enquiries', {
      name, email, phone, subject, message, status: "new"
    });
    
    console.log('📬 New Enquiry Received:', newEnquiry);
    res.status(201).json(newEnquiry);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

module.exports = router;