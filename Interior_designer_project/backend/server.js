const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const path = require("path");

// CORS - allow localhost in dev, and deployed frontend URL in production
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL, // Set this in Render to your Netlify/Vercel URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.some(o => origin.startsWith(o))) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health Check
app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = { 0: "Disconnected", 1: "Connected", 2: "Connecting", 3: "Disconnecting" };
  res.json({
    server: "Running",
    database: states[dbState] || "Unknown",
    time: new Date().toISOString()
  });
});

// MongoDB connect
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Error: ${error.message} - Running in localized mode.`);
    // Don't exit, allow server to run for local storage uploads
  }
};

connectDB();

// Routes
app.use("/api/enquiry", require("./routes/enquiryRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
app.use("/api/visitor", require("./routes/visitorRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/seed", require("./routes/seedRoutes"));

app.get("/", (req, res) => {
  res.send("<h1>Interior Designer API is Running</h1><p>Please visit the <a href='https://interior-designer-frontend-nyf6.onrender.com'>Main Website</a>.</p>");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});