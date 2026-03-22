const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "administrator" }
}, { timestamps: true });

UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  roomType: { type: String },
  images: [String],
  videos: [String],
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const Project = mongoose.model("Project", ProjectSchema);

const BookingSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  serviceType: { type: String },
  message: { type: String },
  bookingDate: { type: String },
  bookingTime: { type: String },
  status: { type: String, default: "pending" }
}, { timestamps: true });

const Booking = mongoose.model("Booking", BookingSchema);

const EnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String },
  status: { type: String, default: "new" }
}, { timestamps: true });

const Enquiry = mongoose.model("Enquiry", EnquirySchema);

const TestimonialSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  project: { type: String },
  review: { type: String, required: true },
  rating: { type: Number, default: 5 },
  approved: { type: Boolean, default: false }
}, { timestamps: true });

const Testimonial = mongoose.model("Testimonial", TestimonialSchema);

const VisitorSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
}, { timestamps: true });

const Visitor = mongoose.model("Visitor", VisitorSchema);

module.exports = { User, Project, Booking, Enquiry, Testimonial, Visitor };
