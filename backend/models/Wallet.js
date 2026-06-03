const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    balance: { type: Number, default: 0 }, // Current balance
    totalEarned: { type: Number, default: 0 }, // Total lifetime earnings
    totalWithdrawn: { type: Number, default: 0 },

    // ✅ Transaction history
    transactions: [
      {
        type: {
          type: String,
          enum: ["earned", "withdrawn", "refunded"],
          required: true,
        },
        amount: Number,
        description: String,
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
        sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "WorkSession" },
        status: { type: String, enum: ["pending", "completed"], default: "pending" },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Wallet", walletSchema);
