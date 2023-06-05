const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  interviewDate: { type: Date, required: true },
  location: { type: String },
  interviewer: { type: String },
  notes: { type: String }
});

module.exports = mongoose.model('Interview', interviewSchema);
