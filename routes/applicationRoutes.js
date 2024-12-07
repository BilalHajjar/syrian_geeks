const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { isAuthenticated } = require('../middleware/auth');

router.get('/:id/applications', isAuthenticated,   async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        const applications = await Application.find({ job: req.params.id }).populate('user', 'name email');
        res.status(200).json(applications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});
router.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('job', 'title')  
      .populate('user', 'name email');  

    if (applications.length === 0) {
      return res.status(404).json({ error: 'No applications found' });
    }

    res.status(200).json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

router.post('/applications', isAuthenticated, async (req, res) => {
  try {
    const { job, resume, additionalDetails } = req.body;

    const existingJob = await Job.findById(job);
    if (!existingJob) {
      console.log(`Job not found with ID: ${job}`);
      return res.status(404).json({ error: 'Job not found' });
    }

    const existingApplication = await Application.findOne({ job, user: req.user.id });
    if (existingApplication) {
      console.log('User has already applied for this job');
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    const newApplication = new Application({
      job,
      user: req.user.id,
      resume,
      additionalDetails,
    });
    await newApplication.save();

    res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
  } catch (err) {
    console.error('Error during application submission:', err);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});


module.exports = router;
