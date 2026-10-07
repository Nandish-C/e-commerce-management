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

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

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