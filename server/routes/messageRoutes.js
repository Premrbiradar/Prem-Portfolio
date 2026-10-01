const express = require('express');
const { body } = require('express-validator');
const {
  createMessage,
  listMessages,
  markAsRead,
  deleteMessage,
} = require('../controllers/messageController');
const { protect, requireAdmin } = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  contactLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('subject').trim().isLength({ min: 2, max: 150 }).withMessage('Subject must be 2-150 characters'),
    body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message must be 10-5000 characters'),
    // Honeypot field: real users never fill this hidden input, bots often do.
    body('company').custom((value) => {
      if (value) throw new Error('Spam detected');
      return true;
    }),
  ],
  validate,
  createMessage
);
router.get('/', protect, requireAdmin, listMessages);
router.patch('/:id/read', protect, requireAdmin, markAsRead);
router.delete('/:id', protect, requireAdmin, deleteMessage);

module.exports = router;
