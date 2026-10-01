const express = require('express');
const { body } = require('express-validator');
const { login, logout, me } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/login',
  loginLimiter,
  [body('email').isEmail().withMessage('A valid email is required'), body('password').notEmpty()],
  validate,
  login
);
router.post('/logout', protect, logout);
router.get('/me', protect, me);

module.exports = router;
