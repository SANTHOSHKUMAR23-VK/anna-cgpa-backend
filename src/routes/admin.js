const express = require('express');
const { isAdmin } = require('../middleware/roles');
const auth = require('../middleware/auth');
const { listUsers, getUserSemesters } = require('../controllers/adminController');

const router = express.Router();

router.use(auth, isAdmin);

router.get('/users', listUsers);
router.get('/users/:id/semesters', getUserSemesters);

module.exports = router;
