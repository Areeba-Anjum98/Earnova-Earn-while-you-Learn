const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "application_received",
        "application_accepted",
        "application_rejected",
        "session_approval_pending",
        "session_approved",
        "payment_received",
        "job_nearby",
        "rating_received",
      ],
      required: true,
    },

    title: String,
    message: String,

    // ✅ Linked to job/session
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkSession" },
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    read: { type: Boolean, default: false },
    readAt: Date,

    actionUrl: String, // Link to job/dashboard etc
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
