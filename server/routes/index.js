const express = require('express');

const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/profile', require('./profileRoutes'));
router.use('/skills', require('./skillRoutes'));
router.use('/projects', require('./projectRoutes'));
router.use('/experience', require('./experienceRoutes'));
router.use('/education', require('./educationRoutes'));
router.use('/certifications', require('./certificationRoutes'));
router.use('/youtube', require('./youtubeRoutes'));
router.use('/resume', require('./resumeRoutes'));
router.use('/messages', require('./messageRoutes'));

module.exports = router;
