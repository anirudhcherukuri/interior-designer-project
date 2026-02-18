const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
    page: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    userAgent: { type: String },
    referrer: { type: String },
    browser: { type: String },
    platform: { type: String },
    language: { type: String },
    screenResolution: { type: String },
    source: { type: String, default: 'Direct' },
    device: { type: String, default: 'Desktop' },
});

module.exports = mongoose.model("Visitor", visitorSchema);