const asyncHandler = require('express-async-handler');
const ContactMessage = require('../models/ContactMessage');
const { sendContactNotification } = require('../services/emailService');

// POST /api/messages (public) — validated by express-validator upstream.
const createMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  const saved = await ContactMessage.create({ name, email, subject, message });

  let emailSent = false;
  try {
    emailSent = await sendContactNotification({ name, email, subject, message });
    if (emailSent) {
      saved.emailSent = true;
      await saved.save();
    }
  } catch (err) {
    // The message is already safely stored in MongoDB even if email delivery
    // fails, so we log the error but still return success to the visitor.
    console.error('Failed to send contact email:', err.message);
  }

  res.status(201).json({
    success: true,
    message: "Thanks for reaching out — I'll get back to you soon.",
  });
});

// GET /api/messages (admin)
const listMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json({ success: true, count: messages.length, data: messages });
});

// PATCH /api/messages/:id/read (admin)
const markAsRead = asyncHandler(async (req, res) => {
  const msg = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    { new: true }
  );
  res.json({ success: true, data: msg });
});

// DELETE /api/messages/:id (admin)
const deleteMessage = asyncHandler(async (req, res) => {
  await ContactMessage.findByIdAndDelete(req.params.id);
  res.json({ success: true, data: {} });
});

module.exports = { createMessage, listMessages, markAsRead, deleteMessage };
