import mongoose from "mongoose";

const cgpaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  gpa: {
    type: Number,
    required: true
  },
  credits: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Prevent duplicate semester for the same user
cgpaSchema.index({ user: 1, semester: 1 }, { unique: true });

const Cgpa = mongoose.models.Cgpa || mongoose.model("Cgpa", cgpaSchema);
export default Cgpa;
