const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // ✅ FIX: ObjectId refs for proper relations
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["applied", "pending", "accepted", "rejected"],
      default: "applied",
    },
    whySelected: { type: String, required: true },
    expertise: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", applicationSchema);
