const express = require("express");
const WorkSession = require("../models/WorkSession");
const Job = require("../models/Job");
const Wallet = require("../models/Wallet");
const Notification = require("../models/Notification");
const auth = require("../middleware/auth");

const router = express.Router();

/* START JOB SESSION (STUDENT) */
router.post("/start", auth, async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "jobId is required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // ✅ Check if session already active
    const existing = await WorkSession.findOne({
      jobId,
      userId: req.user.id,
      active: true,
    });
    if (existing) {
      return res.status(400).json({ message: "Session already active" });
    }

    const session = await WorkSession.create({
      jobId,
      userId: req.user.id,
      employerId: job.employerId,
      startTime: new Date(),
      active: true,
      status: "pending",
    });

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* STOP JOB SESSION (STUDENT) - CALCULATES EARNINGS */
router.post("/stop/:id", auth, async (req, res) => {
  try {
    const session = await WorkSession.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.active) {
      return res.status(400).json({ message: "Session already ended" });
    }

    session.endTime = new Date();
    const durationMs = session.endTime - session.startTime;
    const minutes = Math.floor(durationMs / 60000);

    const job = await Job.findById(session.jobId);
    if (!job) {
      return res.status(404).json({ message: "Associated job not found" });
    }

    let earnings = 0;
    
    // Calculate earnings based on payment model
    if (job.paymentModel === "task") {
      // Task-based: use taskPayment amount directly
      earnings = Number(job.taskPayment);
    } else {
      // Hour-based: calculate from hours worked * hourly rate
      const payPerHour = Number(job.payPerHour);
      if (Number.isNaN(payPerHour)) {
        return res.status(500).json({ message: "Invalid job pay rate" });
      }
      earnings = Number(((minutes / 60) * payPerHour).toFixed(2));
    }
    
    if (Number.isNaN(earnings)) {
      return res.status(500).json({ message: "Could not calculate session earnings" });
    }

    session.durationMinutes = minutes;
    session.earnings = earnings;
    session.active = false;
    session.status = "pending"; // Waiting for employer approval

    await session.save();

    // ✅ Notify employer to approve
    const hoursOrTasks = job.paymentModel === "task" 
      ? "1 task" 
      : `${Math.round((minutes / 60) * 10) / 10} hours`;
    
    await Notification.create({
      userId: session.employerId,
      type: "session_approval_pending",
      title: "Session Ready for Approval",
      message: `Student worked ${hoursOrTasks}. Review and approve payment of Rs. ${earnings.toFixed(2)}.`,
      sessionId: session._id,
      fromUserId: session.userId,
    });

    res.json({
      message: "Session ended - awaiting employer approval",
      minutes,
      earnings: earnings.toFixed(2),
      session,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET USER SESSIONS (DASHBOARD) */
router.get("/:userId", async (req, res) => {
  try {
    const sessions = await WorkSession.find({ userId: req.params.userId })
      .populate("jobId", "title company payPerHour jobDuration paymentModel taskPayment")
      .populate("employerId", "name")
      .sort({ startTime: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET PENDING SESSIONS (FOR EMPLOYER) */
router.get("/pending/employer/:employerId", auth, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers" });
    }

    const sessions = await WorkSession.find({
      employerId: req.params.employerId,
      status: "pending",
    })
      .populate("jobId", "title jobDuration paymentModel taskPayment")
      .populate("userId", "name")
      .sort({ endTime: -1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
