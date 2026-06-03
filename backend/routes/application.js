const express = require("express");
const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");

const router = express.Router();

/* APPLY JOB (LOGIN REQUIRED) */
router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId, whySelected, expertise } = req.body;

    if (!jobId || !whySelected || !expertise) {
      return res.status(400).json({ message: "jobId, whySelected, and expertise are required" });
    }

    const exists = await Application.findOne({ userId, jobId });
    if (exists) {
      if (exists.status === "rejected") {
        exists.status = "applied";
        exists.whySelected = whySelected;
        exists.expertise = expertise;
        exists.updatedAt = new Date();
        await exists.save();
        const job = await Job.findById(jobId);
        if (job && job.employerId) {
          await Notification.create({
            userId: job.employerId,
            type: "application_received",
            title: "New Job Application",
            message: "A student has reapplied to your job.",
            jobId,
            fromUserId: userId,
            actionUrl: "/employer-dashboard",
          });
        }
        return res.json(exists);
      }
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const app = await Application.create({
      userId,
      jobId,
      status: "applied",
      whySelected,
      expertise,
    });

    const job = await Job.findById(jobId);
    if (job && job.employerId) {
      await Notification.create({
        userId: job.employerId,
        type: "application_received",
        title: "New Job Application",
        message: "A student has applied to your job.",
        jobId,
        fromUserId: userId,
        actionUrl: "/employer-dashboard",
      });
    }

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET MY APPLICATIONS */
router.get("/", auth, async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.id })
      .populate("jobId") // ✅ job details bhi milenge
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
