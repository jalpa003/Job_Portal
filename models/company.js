const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  jobRequirements: { type: String, required: true },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Casual', 'Seasonal', 'Internship'], required: true },
  workSchedule: { type: String },
  preferredStartDate: { type: Date },
  payRate: { type: Number },
  benefits: { type: String },
  deadline: { type: Date, required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
  interviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interview' }]
});

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactInfo: { type: String },
  industry: { type: String },
  description: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobs: [jobSchema]
});

const Company = mongoose.model('Company', companySchema);

// Export the Company model
module.exports = Company;
