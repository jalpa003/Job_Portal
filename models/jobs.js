// const mongoose = require('mongoose');

// const jobPostSchema = new mongoose.Schema({
//   jobTitle: { type: String, required: true },
//   jobDescription: { type: String, required: true },
//   jobRequirements: { type: String, required: true },
//   jobType: { type: String, enum: ['Full-time', 'Part-time', 'Casual', 'Seasonal', 'Internship'], required: true },
//   workSchedule: { type: String },
//   preferredStartDate: { type: Date },
//   payRate: { type: Number },
//   benefits: { type: String },
//   deadline: { type: Date, required: true },
//   applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
//   interviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interview' }]
// });

// const JobPost = mongoose.model('Job', jobPostSchema);

// module.exports = JobPost;
