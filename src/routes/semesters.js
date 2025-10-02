const express = require('express');
const { check } = require('express-validator');
const handleValidation = require('../middleware/validation');
const auth = require('../middleware/auth');

const { upsertSemester, listSemesters, deleteSemester, calculateCgpa } = require('../controllers/semesterController');

const router = express.Router();

router.use(auth);

router.post('/', [
  check('semester').isInt({ min: 1 }).withMessage('Semester must be integer >=1'),
  check('gpa').isFloat({ min: 0, max: 10 }).withMessage('GPA must be between 0 and 10'),
  check('credits').isFloat({ min: 0 }).withMessage('Credits must be positive')
], handleValidation, upsertSemester);

router.get('/', listSemesters);
router.delete('/:id', deleteSemester);
router.get('/cgpa', calculateCgpa);

module.exports = router;
