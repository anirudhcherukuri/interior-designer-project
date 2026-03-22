const express = require("express");
const router = express.Router();
const jsonDb = require("../utils/jsonDb");
const auth = require("../middleware/authMiddleware");

// GET approved testimonials - Public
router.get("/", (req, res) => {
  try {
    const list = jsonDb.get('testimonials') || [];
    const approvedOnly = list.filter(t => t.approved === true);
    res.json(approvedOnly);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// GET all testimonials (including pending) - Protected
router.get("/all", auth, (req, res) => {
  try {
    const list = jsonDb.get('testimonials') || [];
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

// POST create testimonial - Public (Mass assignment protection)
router.post("/", (req, res) => {
  try {
    const { clientName, project, review, rating } = req.body;
    
    // Explicitly set approved to false regardless of payload
    const newTestimonial = jsonDb.add('testimonials', {
      clientName, project, review, rating, approved: false
    });
    
    console.log("📝 NEW TESTIMONIAL RECEIVED:", newTestimonial);
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(400).json({ error: "Invalid Data" });
  }
});

// PATCH testimonial status - Protected
router.patch("/:id", auth, (req, res) => {
  try {
    // Only pass keys we want to allow updating
    const updated = jsonDb.update('testimonials', req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Not Found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: "Error updating" });
  }
});

// DELETE testimonial - Protected
router.delete("/:id", auth, (req, res) => {
  try {
    const success = jsonDb.delete('testimonials', req.params.id);
    if (!success) return res.status(404).json({ error: "Not Found" });
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: "Error deleting" });
  }
});

module.exports = router;
