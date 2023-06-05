const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  workExperience: { type: String },
  desiredJobType: { type: String, enum: ['FT', 'PT', 'Temp', 'Apprentice'] },
  desiredWorkSchedule: { type: String },
  distanceFromAddress: { type: String },
  resume: { type: Buffer },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
