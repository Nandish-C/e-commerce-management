const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();

// Allowed origins: deployed frontend (from .env) + local dev servers
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no Origin header (curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS: " + origin));
      }
    },
  })
);
app.use(express.json());

// MongoDB Connection (cached across serverless invocations)
const cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not set");
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((conn) => conn)
      .catch((err) => {
        cached.promise = null; // allow retry on the next request
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Connect on startup (local dev) — cached.promise is reused by the middleware
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

// Ensure the database is connected before handling API routes
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: "Database connection failed: " + err.message });
  }
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// Test Route
app.get("/", (req, res) => {
  res.send("Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);

// Export the app for testing or custom servers
module.exports = app;