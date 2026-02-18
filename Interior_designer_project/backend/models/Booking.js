const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    clientName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, default: "" }, // New field
    budget: { type: String, default: "" },   // New field
    message: { type: String, default: "" },
    serviceType: { type: String, default: "" },
    bookingDate: { type: Date, required: false },
    bookingTime: { type: String, required: false },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending",
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
