const User = require('../models/User');
const Semester = require('../models/Semester');

const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getUserSemesters = async (req, res) => {
  try {
    const { id } = req.params;
    const sems = await Semester.find({ user: id }).sort({ semester: 1 });
    res.json({ semesters: sems });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { listUsers, getUserSemesters };
