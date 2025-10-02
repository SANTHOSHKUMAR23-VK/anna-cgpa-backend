import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  semesters: [
    {
      semester: Number,
      gpa: Number,
      credits: Number,
    },
  ],
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
});

export default mongoose.model("User", userSchema);

