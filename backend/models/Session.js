const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    // ✅ FIX: ObjectId refs
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    startTime: Date,
    endTime: Date,
    hours: Number,
    hourlyRate: Number,
    earnings: Number,
    status: { type: String, default: "running" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Session", sessionSchema);
