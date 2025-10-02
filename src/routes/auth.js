const express = require('express');
const { check } = require('express-validator');
const handleValidation = require('../middleware/validation');
const { register, login, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', [
  check('name').notEmpty().withMessage('Name is required'),
  check('email').isEmail(),
  check('password').isLength({ min: 6 })
], handleValidation, register);

router.post('/login', [
  check('email').isEmail(),
  check('password').exists()
], handleValidation, login);

router.get('/me', auth, getMe);

module.exports = router;
