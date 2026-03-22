const express = require("express");
const router = express.Router();
const jsonDb = require("../utils/jsonDb");
const auth = require("../middleware/authMiddleware");

// GET bookings - Protected
router.get("/", auth, (req, res) => {
  try {
    const bookings = jsonDb.get('bookings') || [];
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// POST create booking - Public (Protected against IDOR status assignment)
router.post("/", (req, res) => {
  try {
    const { clientName, email, phone, serviceType, message, bookingDate, bookingTime } = req.body;
    
    // Explicit assignment to prevent mass-assignment/IDOR
    const newBooking = jsonDb.add('bookings', {
      clientName, email, phone, serviceType, message, bookingDate, bookingTime,
      status: "pending" // Always start as pending
    });
    
    console.log("📅 NEW BOOKING REQUEST RECEIVED:", newBooking);
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
});

// PATCH booking status - Protected
router.patch("/:id", auth, (req, res) => {
  try {
    const updated = jsonDb.update('bookings', req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Not Found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: "Error updating" });
  }
});

// DELETE booking - Protected
router.delete("/:id", auth, (req, res) => {
  try {
    const success = jsonDb.delete('bookings', req.params.id);
    if (!success) return res.status(404).json({ error: "Not Found" });
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: "Error deleting" });
  }
});

module.exports = router;
