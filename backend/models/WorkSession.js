const mongoose = require("mongoose");

const workSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    startTime: Date,
    endTime: Date,
    durationMinutes: Number,
    earnings: Number,

    // ✅ Session approval workflow
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "rejected"],
      default: "pending",
    },

    // ✅ Employer approval
    approvedAt: Date,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("WorkSession", workSchema);
