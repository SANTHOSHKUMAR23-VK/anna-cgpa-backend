const Semester = require('../../cgpa-backend/models/Semester');

// Create or update semester (one record per user per semester)
const upsertSemester = async (req, res) => {
  try {
    const { semester, gpa, credits } = req.body;
    const userId = req.user._id;

    const data = { user: userId, semester, gpa, credits };

    const result = await Semester.findOneAndUpdate(
      { user: userId, semester },
      data,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ semester: result });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const listSemesters = async (req, res) => {
  try {
    const userId = req.user._id;
    const sems = await Semester.find({ user: userId }).sort({ semester: 1 });
    res.json({ semesters: sems });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteSemester = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const sem = await Semester.findOneAndDelete({ _id: id, user: userId });
    if (!sem) return res.status(404).json({ message: 'Semester not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// CGPA calculation
const calculateCgpa = async (req, res) => {
  try {
    const userId = req.user._id;
    const sems = await Semester.find({ user: userId });

    if (!sems.length) return res.json({ cgpa: 0, totalCredits: 0, message: 'No semesters added yet' });

    // CGPA = Σ(gpa_i * credits_i) / Σ(credits_i)
    let num = 0;
    let den = 0;
    sems.forEach(s => {
      num += (s.gpa * s.credits);
      den += s.credits;
    });

    const cgpa = den === 0 ? 0 : Number((num / den).toFixed(3)); // keep 3 decimals
    res.json({ cgpa, totalCredits: den, semestersCount: sems.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { upsertSemester, listSemesters, deleteSemester, calculateCgpa };
