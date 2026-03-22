const express = require('express');
const router = express.Router();
const jsonDb = require('../utils/jsonDb');
const auth = require('../middleware/authMiddleware');

// GET all enquiries — Protected
router.get('/', auth, (req, res) => {
  try {
    const enquiries = jsonDb.get('enquiries') || [];
    res.json(enquiries);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create enquiry — Public
router.post('/', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const newEnquiry = jsonDb.add('enquiries', {
      name, email, phone, subject, message,
      status: 'unread', // consistent with Admin badge system
    });
    console.log('📬 New Enquiry Received:', newEnquiry);
    res.status(201).json(newEnquiry);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// PATCH update enquiry status — Protected (e.g. mark as read)
router.patch('/:id', auth, (req, res) => {
  try {
    const { status } = req.body;
    // Only allow status field to be updated (prevents mass-assignment)
    const updated = jsonDb.update('enquiries', req.params.id, { status });
    if (!updated) return res.status(404).json({ error: 'Enquiry not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Error updating enquiry' });
  }
});

// DELETE enquiry — Protected
router.delete('/:id', auth, (req, res) => {
  try {
    const success = jsonDb.delete('enquiries', req.params.id);
    if (!success) return res.status(404).json({ error: 'Enquiry not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Error deleting enquiry' });
  }
});

module.exports = router;