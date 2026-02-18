const express = require("express");
const router = express.Router();

const Enquiry = require("../models/Enquiry");

// Save enquiry
router.post("/", async (req, res) => {
  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get enquiries (admin)
router.get("/", async (req, res) => {
  const data = await Enquiry.find();
  res.json(data);
});

module.exports = router;