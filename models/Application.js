const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resume: { type: String, required: true },
    additionalDetails: { type: String },
    status: { 
      type: String, 
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'], 
      default: 'PENDING' 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
