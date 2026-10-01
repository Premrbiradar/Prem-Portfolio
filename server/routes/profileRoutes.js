const express = require('express');
const {
  getProfile,
  updateProfile,
  updateProfilePhoto,
  deleteProfilePhoto,
} = require('../controllers/profileController');
const { protect, requireAdmin } = require('../middleware/auth');
const { uploadImage, guardCloudinary } = require('../middleware/upload');

const router = express.Router();
const photoUpload = uploadImage('profile');

router.get('/', getProfile);
router.put('/', protect, requireAdmin, updateProfile);
router.post(
  '/photo',
  protect,
  requireAdmin,
  guardCloudinary,
  photoUpload.single('photo'),
  updateProfilePhoto
);
router.delete('/photo', protect, requireAdmin, deleteProfilePhoto);

module.exports = router;
