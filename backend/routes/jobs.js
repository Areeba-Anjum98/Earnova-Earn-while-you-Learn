const express = require("express");
const Job = require("../models/Job");
const Application = require("../models/Application");
const WorkSession = require("../models/WorkSession");
const Notification = require("../models/Notification");
const Wallet = require("../models/Wallet");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

/* GET ALL JOBS (PUBLIC) - WITH EMPLOYER DETAILS */
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" })
      .populate("employerId", "name avgRating location verified")
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET JOBS FOR EMPLOYER */
router.get("/employer/:employerId", auth, async (req, res) => {
  try {
    if (req.user.role !== "employer" || req.user.id !== req.params.employerId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const jobs = await Job.find({ employerId: req.params.employerId })
      .sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET JOB DETAIL */
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "employerId",
      "name bio avgRating location verified phone",
    );

    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* CREATE JOB (EMPLOYER ONLY) */
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can create jobs" });
    }

    const {
      title,
      company,
      paymentModel,
      payPerHour,
      taskPayment,
      jobDuration,
      location,
      description,
      startTime,
      endTime,
      type,
      tag,
      requiredSkills,
    } = req.body;

    if (!title || !company || !paymentModel) {
      return res.status(400).json({ message: "Title, company and payment model are required" });
    }

    if (paymentModel === "task") {
      if (!taskPayment || Number.isNaN(Number(taskPayment)) || Number(taskPayment) <= 0) {
        return res.status(400).json({ message: "Task payment is required for task-based jobs" });
      }
    } else {
      if (!payPerHour || Number.isNaN(Number(payPerHour)) || Number(payPerHour) <= 0) {
        return res.status(400).json({ message: "Hourly rate is required for hourly jobs" });
      }
    }

    const job = await Job.create({
      title,
      company,
      description: description || "",
      paymentModel,
      payPerHour: paymentModel === "hourly" ? Number(payPerHour) : 0,
      taskPayment: paymentModel === "task" ? Number(taskPayment) : 0,
      jobDuration: paymentModel === "hourly" ? Number(jobDuration) || 0 : 0,
      startTime: startTime || "09:00",
      endTime: endTime || "17:00",
      location: location || "Islamabad",
      type: type || "Remote",
      tag: tag || "General",
      requiredSkills: Array.isArray(requiredSkills)
        ? requiredSkills
        : typeof requiredSkills === "string"
        ? requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      employerId: req.user.id,
    });

    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* DELETE JOB (EMPLOYER ONLY) */
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can delete jobs" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ jobId: job._id });

    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ACCEPT APPLICATION (EMPLOYER) */
router.post("/accept", auth, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { applicationId } = req.body;
    const app = await Application.findById(applicationId);
    if (!app) return res.status(404).json({ message: "Application not found" });

    const job = await Job.findById(app.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (app.status !== "applied") {
      return res.status(400).json({ message: "Application has already been processed" });
    }

    app.status = "accepted";
    await app.save();

    // ✅ Send notification to student
    await Notification.create({
      userId: app.userId,
      type: "application_accepted",
      title: "Application Accepted!",
      message: "Your job application has been accepted",
      jobId: app.jobId,
      fromUserId: req.user.id,
    });

    // ✅ Send notification to student
    await Notification.create({
      userId: app.userId,
      type: "application_accepted",
      title: "Application Accepted!",
      message: "Your job application has been accepted.",
      jobId: app.jobId,
      fromUserId: req.user.id,
      actionUrl: "/student-dashboard",
    });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* REJECT APPLICATION (EMPLOYER) */
router.post("/reject", auth, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { applicationId } = req.body;
    const app = await Application.findById(applicationId);
    if (!app) return res.status(404).json({ message: "Application not found" });

    const job = await Job.findById(app.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    app.status = "rejected";
    await app.save();

    await Notification.create({
      userId: app.userId,
      type: "application_rejected",
      title: "Application Rejected",
      message: "Your job application was rejected.",
      jobId: app.jobId,
      fromUserId: req.user.id,
      actionUrl: "/student-dashboard",
    });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET APPLICATIONS FOR EMPLOYER'S JOBS */
router.get("/employer/:employerId/applications", auth, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employers can view applications" });
    }

    const { employerId } = req.params;
    const jobs = await Job.find({ employerId });
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("userId", "name bio avgRating location skills")
      .populate("jobId", "title payPerHour")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* APPROVE SESSION (EMPLOYER) */
router.post("/approve-session", auth, async (req, res) => {
  try {
    if (req.user.role !== "employer") {
      return res.status(403).json({ message: "Only employer can approve" });
    }

    const { sessionId } = req.body;
    const session = await WorkSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.status = "approved";
    session.approvedAt = new Date();
    session.approvedBy = req.user.id;
    await session.save();

    // ✅ Resolve earnings if needed
    let earnings = Number(session.earnings);
    if (Number.isNaN(earnings)) {
      const job = await Job.findById(session.jobId);
      if (job && typeof session.durationMinutes === "number") {
        const payPerHour = Number(job.payPerHour);
        if (!Number.isNaN(payPerHour)) {
          earnings = Number(((session.durationMinutes / 60) * payPerHour).toFixed(2));
          if (!Number.isNaN(earnings)) {
            session.earnings = earnings;
            await session.save();
          }
        }
      }
    }

    if (Number.isNaN(earnings)) {
      return res.status(500).json({ message: "Invalid session earnings" });
    }

    // ✅ Add earnings to wallet
    let wallet = await Wallet.findOne({ userId: session.userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId: session.userId });
    }

    wallet.balance += earnings;
    wallet.totalEarned += earnings;
    wallet.transactions.push({
      type: "earned",
      amount: earnings,
      description: "Work session earnings",
      sessionId: session._id,
      status: "completed",
    });
    await wallet.save();

    // ✅ Send notification
    await Notification.create({
      userId: session.userId,
      type: "session_approved",
      title: "Session Approved!",
      message: `You earned Rs. ${session.earnings.toFixed(2)}`,
      sessionId: session._id,
      fromUserId: req.user.id,
    });

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
