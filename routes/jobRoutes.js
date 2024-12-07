const express = require('express');
const Job = require('../models/Job');
const { isAuthenticated, isRole } = require('../middleware/auth');  // التأكد من وجود التحقق من الصلاحية
const router = express.Router();
const Application = require('../models/Application');

router.get('/search', async (req, res) => {
  try {
    const { keyword } = req.query;

    // إذا لم يتم توفير الكلمة المفتاحية، إرجاع خطأ
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required for search' });
    }

    // البحث عن الوظائف باستخدام الكلمة المفتاحية في العنوان أو الوصف
    const jobs = await Job.find({
      $or: [
        { title: new RegExp(keyword, 'i') },  // البحث في العنوان (title)
        { description: new RegExp(keyword, 'i') }  // البحث في الوصف (description)
      ]
    }).populate('employer', 'name email');  // جلب بيانات صاحب العمل (الاسم والبريد الإلكتروني)

    // إذا لم يتم العثور على أي وظائف تطابق البحث
    if (jobs.length === 0) {
      return res.status(404).json({ error: 'No jobs found matching the keyword' });
    }

    // إرجاع الوظائف التي تم العثور عليها
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search for jobs' });
  }
});

router.post('/add', isAuthenticated, async (req, res) => {
  const { title, description, location, salaryRange, applicationDeadline, category } = req.body;

  try {
    if (!title || !description || !location || !salaryRange || !applicationDeadline || !category) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newJob = new Job({
      title,
      description,
      location,
      salaryRange,
      applicationDeadline,
      employer: req.user.id,  
      category,
    });

    await newJob.save();
    res.status(201).json({ message: 'Job created successfully', job: newJob });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

router.put('/:id', isAuthenticated, async (req, res) => {
  const { title, description, location, salaryRange, applicationDeadline, category } = req.body;

  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this job' });
    }

    job.title = title || job.title;
    job.description = description || job.description;
    job.location = location || job.location;
    job.salaryRange = salaryRange || job.salaryRange;
    job.applicationDeadline = applicationDeadline || job.applicationDeadline;
    job.category = category || job.category;

    await job.save();
    res.status(200).json({ message: 'Job updated successfully', job });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this job' });
    }

    await job.remove();
    res.status(200).json({ message: 'Job deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name email');
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch job details' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { keyword, category, location, salaryRange } = req.query;

    const filters = {};
    if (keyword) filters.title = new RegExp(keyword, 'i');
    if (category) filters.category = category;
    if (location) filters.location = location;
    if (salaryRange) filters.salaryRange = salaryRange;

    const jobs = await Job.find(filters).populate('employer', 'name email');
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

module.exports = router;
