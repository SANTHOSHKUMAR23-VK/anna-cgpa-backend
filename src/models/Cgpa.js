// src/models/Cgpa.js
import mongoose from "mongoose";

const cgpaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      unique: true, // 👈 this prevents duplicates per user
    },
    gpa: {
      type: Number,
      required: [true, "GPA is required"],
      min: [0, "GPA cannot be less than 0"],
      max: [10, "GPA cannot be more than 10"],
    },
    credits: {
      type: Number,
      required: [true, "Credits are required"], // 👈 fix here
      min: [1, "Credits must be at least 1"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cgpa", cgpaSchema);
