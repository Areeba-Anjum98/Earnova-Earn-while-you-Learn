const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, default: "" },

    // ✅ Job payment model
    paymentModel: { type: String, enum: ["hourly", "task"], default: "hourly" },
    payPerHour: { type: Number, required: true },
    taskPayment: { type: Number, default: 0 },

    // ✅ Job timing
    jobDuration: { type: Number, default: 8 }, // hours
    startTime: { type: String, default: "09:00" }, // 24-hour format
    endTime: { type: String, default: "17:00" },

    tag: { type: String, default: "General" },
    type: { type: String, default: "Remote" }, // Remote/On-site/Hybrid
    location: { type: String, default: "Islamabad" },

    // ✅ Job requirements
    requiredSkills: [String],

    featured: { type: Boolean, default: false },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "open" }, // open/closed/filled
    applicantCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Job", jobSchema);
