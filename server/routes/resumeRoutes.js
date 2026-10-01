const express = require('express');
const {
  getActiveResume,
  listResumes,
  uploadResume,
  setActiveResume,
  deleteResume,
} = require('../controllers/resumeController');
const { protect, requireAdmin } = require('../middleware/auth');
const { uploadResume: resumeUploadMiddleware, guardCloudinary } = require('../middleware/upload');

const router = express.Router();

router.get('/', getActiveResume);
router.get('/all', protect, requireAdmin, listResumes);
router.post(
  '/',
  protect,
  requireAdmin,
  guardCloudinary,
  resumeUploadMiddleware.single('resume'),
  uploadResume
);
router.patch('/:id/activate', protect, requireAdmin, setActiveResume);
router.delete('/:id', protect, requireAdmin, deleteResume);

module.exports = router;
