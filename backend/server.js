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

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    const allowed = [
      "http://localhost:3000",
      "https://interior-designer-frontend-zhjl.onrender.com",
      "https://interior-designer-frontend-nyf6.onrender.com",
      "https://interior-designer-project-9ae0.onrender.com"
    ];

    if (allowed.indexOf(origin) !== -1 || origin.endsWith(".onrender.com")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: "1mb" })); 
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/gallery", express.static(path.join(__dirname, "../frontend/public/gallery")));

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
app.use("/api/houses", require("./routes/houseRoutes"));
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
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Secure API server started and listening on 0.0.0.0:${PORT}`);
});