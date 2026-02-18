const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Create a new booking
router.post('/', async (req, res) => {
    try {
        console.log("Booking Request Received:", req.body); // LOGGING ADDED
        const { bookingDate, bookingTime } = req.body;

        // Check date/time
        if (!bookingDate || !bookingTime) {
            console.error("Booking Error: Missing Date/Time");
            return res.status(400).json({ error: "Date and Time are required" });
        }

        const startOfDay = new Date(bookingDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(bookingDate);
        endOfDay.setHours(23, 59, 59, 999);

        // Check if specific slot is taken
        const existingSlot = await Booking.findOne({
            bookingDate: { $gte: startOfDay, $lte: endOfDay },
            bookingTime: bookingTime
        });

        if (existingSlot) {
            return res.status(400).json({ error: "This time slot is already booked. Please choose another." });
        }

        // Check if daily limit reached (4 slots)
        const dailyCount = await Booking.countDocuments({
            bookingDate: { $gte: startOfDay, $lte: endOfDay }
        });

        if (dailyCount >= 4) {
            return res.status(400).json({ error: "All slots for this date are fully booked." });
        }

        const newBooking = new Booking(req.body);
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all bookings (Admin only, potentially)
router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update booking status (Admin)
router.patch('/:id', async (req, res) => {
    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedBooking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a booking
router.delete('/:id', async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
