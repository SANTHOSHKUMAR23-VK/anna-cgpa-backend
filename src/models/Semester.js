const mongoose = require('mongoose');

const SemesterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  semester: { type: Number, required: true },   // 1..N
  gpa: { type: Number, required: true },        // e.g. 8.45
  credits: { type: Number, required: true },    // total credits for that sem
  createdAt: { type: Date, default: Date.now }
});

// To ensure one record per user per semester
SemesterSchema.index({ user: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Semester', SemesterSchema);
