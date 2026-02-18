const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    project: { type: String, default: "" }, // Optional project name link
    projectImage: { type: String, default: "" }, // Optional image for context
    approved: { type: Boolean, default: false }, // Admin approval required
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
