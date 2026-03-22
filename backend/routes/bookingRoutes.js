const express = require("express");
const router = express.Router();
const jsonDb = require("../utils/jsonDb");
const auth = require("../middleware/authMiddleware");

// GET all bookings — Protected
router.get("/", auth, (req, res) => {
  try {
    const bookings = jsonDb.get('bookings') || [];
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// POST create booking — Public
router.post("/", (req, res) => {
  try {
    const { clientName, email, phone, serviceType, message, bookingDate, bookingTime } = req.body;
    const newBooking = jsonDb.add('bookings', {
      clientName, email, phone, serviceType, message, bookingDate, bookingTime,
      status: "pending", // always starts as pending — prevents IDOR
    });
    console.log("📅 NEW BOOKING REQUEST RECEIVED:", newBooking);
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
});

// PATCH update booking status — Protected
// Only allows status to be updated (confirmed / rejected / pending)
router.patch("/:id", auth, (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "confirmed", "rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${allowed.join(", ")}` });
    }
    const updated = jsonDb.update('bookings', req.params.id, { status });
    if (!updated) return res.status(404).json({ error: "Booking not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: "Error updating booking" });
  }
});

// DELETE booking — Protected
router.delete("/:id", auth, (req, res) => {
  try {
    const success = jsonDb.delete('bookings', req.params.id);
    if (!success) return res.status(404).json({ error: "Booking not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Error deleting booking" });
  }
});

module.exports = router;