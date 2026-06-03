const express = require("express");
const User = require("../models/User");
const Rating = require("../models/Rating");
const WorkSession = require("../models/WorkSession");
const auth = require("../middleware/auth");

const router = express.Router();

/* GET USER PROFILE */
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Get ratings
    const ratings = await Rating.find({ toUserId: req.params.userId });

    // ✅ Get work stats for students
    let workStats = {};
    if (user.role === "student") {
      const sessions = await WorkSession.find({ userId: req.params.userId });
      const completedSessions = sessions.filter((s) => s.status === "approved");
      const totalEarnings = completedSessions.reduce((sum, s) => sum + s.earnings, 0);
      const totalHours = completedSessions.reduce((sum, s) => sum + s.durationMinutes, 0) / 60;

      workStats = {
        totalEarnings: totalEarnings.toFixed(2),
        totalHours: totalHours.toFixed(1),
        jobsCompleted: completedSessions.length,
      };
    }

    res.json({
      user,
      ratings,
      workStats,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE PROFILE (AUTH REQUIRED) */
router.patch("/", auth, async (req, res) => {
  try {
    const { name, bio, phone, location, skills, availability, bankDetails } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(phone && { phone }),
        ...(location && { location }),
        ...(skills && { skills }),
        ...(availability && { availability }),
        ...(bankDetails && { bankDetails }),
      },
      { new: true },
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET MY PROFILE */
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
