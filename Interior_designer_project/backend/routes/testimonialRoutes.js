const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

// Create a new testimonial
router.post('/', async (req, res) => {
    try {
        const newTestimonial = new Testimonial(req.body);
        const saved = await newTestimonial.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET enabled/approved testimonials (Public)
router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ approved: true }).sort({ createdAt: -1 });
        res.status(200).json(testimonials);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all testimonials (Admin)
router.get('/all', async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.status(200).json(testimonials);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update testimonial (Approve/Reject)
router.patch('/:id', async (req, res) => {
    try {
        const updated = await Testimonial.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete testimonial
router.delete('/:id', async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
