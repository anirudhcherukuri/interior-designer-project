const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  location: { type: String, default: "" },
  roomType: { type: String, required: true },
  featured: { type: Boolean, default: false },
  images: { type: [String], default: [] },
  videos: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

projectSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Project", projectSchema);
