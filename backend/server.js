const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Routes
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");
const applicationRoutes = require("./routes/application");
const workRoutes = require("./routes/work");
const walletRoutes = require("./routes/wallet");
const notificationRoutes = require("./routes/notification");
const ratingRoutes = require("./routes/rating");
const profileRoutes = require("./routes/profile");

const app = express();

/* =========================
   MIDDLEWARES
========================= */

// ✅ FIX: Proper CORS config for frontend
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

/* =========================
   DATABASE CONNECTION
========================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.log("MongoDB Error ❌:", err));

/* =========================
   ROUTES
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/work", workRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/profile", profileRoutes);

/* =========================
   TEST ROUTE
========================= */

app.get("/", (req, res) => {
  res.send("🚀 StudentWage Backend is Running Successfully");
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
