const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    salaryRange: { type: String, required: true },
    applicationDeadline: { type: Date, required: true },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
