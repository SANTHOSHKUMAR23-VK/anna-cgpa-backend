// src/controllers/cgpaController.js
import Cgpa from "../models/Cgpa.js";

// @desc    Add semester GPA
// @route   POST /api/cgpa
// @access  Private
export const addCgpa = async (req, res) => {
  try {
    const { semester, gpa, credits } = req.body;

    if (!semester || !gpa || !credits) {
      return res.status(400).json({ message: "Semester, GPA, and Credits are required" });
    }

    const record = await Cgpa.create({
      user: req.user._id,
      semester,
      gpa,
      credits,
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all GPA records + CGPA
// @route   GET /api/cgpa
// @access  Private
export const getCgpa = async (req, res) => {
  try {
    const records = await Cgpa.find({ user: req.user._id });

    // Weighted CGPA calculation
    let totalPoints = 0;
    let totalCredits = 0;
    records.forEach((rec) => {
      totalPoints += rec.gpa * rec.credits;
      totalCredits += rec.credits;
    });

    const cgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

    res.json({ records, cgpa });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update semester GPA/credits
// @route   PUT /api/cgpa/:id
// @access  Private
export const updateSemester = async (req, res) => {
  try {
    const record = await Cgpa.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Semester record not found" });
    }

    if (record.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    record.gpa = req.body.gpa || record.gpa;
    record.credits = req.body.credits || record.credits;
    await record.save();

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete semester GPA
// @route   DELETE /api/cgpa/:id
// @access  Private
export const deleteSemester = async (req, res) => {
  try {
    const record = await Cgpa.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Semester record not found" });
    }

    if (record.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await record.deleteOne();
    res.json({ message: "Semester deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
