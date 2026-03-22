const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Using local JSON DB and Cloudinary for storage as per user requirement (No MongoDB)
const jsonDb = require("./utils/jsonDb");

const app = express();

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(cookieParser());

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too many requests from this IP, please try again later."
});
app.use("/api", globalLimiter);

const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "https://interior-designer-frontend-nyf6.onrender.com"
];
app.use(cors({
  origin: true, // Allow all origins for local debugging
  credentials: true
}));

app.use(express.json({ limit: "1mb" })); 
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    server: "Running securely",
    database: "Local JSON Utility + Cloudinary",
    protection: "Helmet, Rate Limiter, XSS Clean, Sanitized Inputs",
    time: new Date().toISOString()
  });
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/enquiry", require("./routes/enquiryRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/visitor", require("./routes/visitorRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));

app.get("/", (req, res) => {
  res.send("<h1>Interior Designer Secure API is Running</h1>");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🚨 ERROR:", err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Secure API server started on port", PORT);
});