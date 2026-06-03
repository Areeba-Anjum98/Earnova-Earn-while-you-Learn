const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkSession" },

    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,

    // ✅ Who rates whom
    type: {
      type: String,
      enum: ["student_to_employer", "employer_to_student"],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Rating", ratingSchema);
