const express = require("express");
const router = express.Router();
const Job = require("../models/job");
const { protect, authorize } = require("../middleware/authMiddleware");

// GET /api/jobs - Get all open jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ status: "open" })
      .populate("postedBy", "name email location")
      .sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error: error.message });
  }
});

// GET /api/jobs/user - Get jobs posted by the logged-in user
// (Can be used by both clients and freelancers if needed, but usually clients)
router.get("/user", protect, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id })
      .populate("applicants", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user jobs", error: error.message });
  }
});

// POST /api/jobs - Create a new job
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, budget, location, category, image } = req.body;
    
    const job = await Job.create({
      title,
      description,
      budget,
      location,
      category,
      image,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Error creating job", error: error.message });
  }
});

// POST /api/jobs/:id/apply - Apply for a job (Freelancer only)
router.post("/:id/apply", protect, authorize("freelancer"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    job.applicants.push(req.user._id);
    await job.save();

    res.status(200).json({ message: "Applied successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error applying for job", error: error.message });
  }
});

// GET /api/jobs/applied - Jobs current freelancer applied to
router.get("/applied", protect, authorize("freelancer"), async (req, res) => {
  try {
    const jobs = await Job.find({ applicants: req.user._id }).populate("postedBy", "name email");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applied jobs", error: error.message });
  }
});

// GET /api/jobs/active - Jobs freelancer is currently working on
router.get("/active", protect, authorize("freelancer"), async (req, res) => {
  try {
    const jobs = await Job.find({ hiredFreelancer: req.user._id, status: "in-progress" }).populate("postedBy", "name email");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching active jobs", error: error.message });
  }
});

// PATCH /api/jobs/:id/hire - Hire a freelancer (Client only)
router.patch("/:id/hire", protect, authorize("client"), async (req, res) => {
  try {
    const { freelancerId } = req.body;
    const job = await Job.findById(req.params.id);
    
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status !== "open") return res.status(400).json({ message: "Job is not open for hiring." });

    job.hiredFreelancer = freelancerId;
    job.status = "in-progress";
    await job.save();

    res.status(200).json({ message: "Freelancer hired successfully!", job });
  } catch (error) {
    res.status(500).json({ message: "Error hiring freelancer", error: error.message });
  }
});

// PATCH /api/jobs/:id/complete - Mark job as complete (Freelancer only)
router.patch("/:id/complete", protect, authorize("freelancer"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    
    if (job.hiredFreelancer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the hired freelancer can complete this job." });
    }

    job.status = "completed";
    job.completedAt = new Date();
    await job.save();

    res.status(200).json({ message: "Job marked as completed!", job });
  } catch (error) {
    res.status(500).json({ message: "Error completing job", error: error.message });
  }
});

module.exports = router;
