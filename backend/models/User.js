const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,

    role: {
      type: String,
      enum: ["student", "employer"],
      default: "student",
    },

    // ✅ Profile
    bio: String,
    avatar: String,
    location: { type: String, default: "Islamabad" },

    // ✅ Student fields
    skills: [String],
    availability: {
      startHour: { type: Number, default: 9 },
      endHour: { type: Number, default: 17 },
    },

    // ✅ Rating system
    avgRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },

    // ✅ Verification
    verified: { type: Boolean, default: false },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
