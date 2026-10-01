const asyncHandler = require('express-async-handler');
const Profile = require('../models/Profile');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

// The site has exactly one Profile document. It is created on first read if
// it doesn't exist yet, seeded with sensible defaults from the schema.
const getOrCreateProfile = async () => {
  let profile = await Profile.findOne();
  if (!profile) profile = await Profile.create({});
  return profile;
};

// GET /api/profile (public)
const getProfile = asyncHandler(async (req, res) => {
  const profile = await getOrCreateProfile();
  res.json({ success: true, data: profile });
});

// PUT /api/profile (admin) — updates any editable text/link fields.
const updateProfile = asyncHandler(async (req, res) => {
  const profile = await getOrCreateProfile();
  const editableFields = [
    'name',
    'title',
    'secondaryTitle',
    'headline',
    'heroIntro',
    'about',
    'brandStatement',
    'currentRoleNote',
    'location',
    'email',
    'phone',
    'linkedin',
    'github',
    'youtube',
    'youtubeChannelName',
    'youtubeTagline',
  ];
  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) profile[field] = req.body[field];
  });
  await profile.save();
  res.json({ success: true, data: profile });
});

// POST /api/profile/photo (admin) — replaces the primary profile photo.
const updateProfilePhoto = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No image file received.');
  const profile = await getOrCreateProfile();

  if (isCloudinaryConfigured && profile.profilePhotoPublicId) {
    await cloudinary.uploader.destroy(profile.profilePhotoPublicId).catch(() => {});
  }

  profile.profilePhotoUrl = req.file.path || profile.profilePhotoUrl;
  profile.profilePhotoPublicId = req.file.filename || '';
  await profile.save();
  res.json({ success: true, data: profile });
});

// DELETE /api/profile/photo (admin)
const deleteProfilePhoto = asyncHandler(async (req, res) => {
  const profile = await getOrCreateProfile();
  if (isCloudinaryConfigured && profile.profilePhotoPublicId) {
    await cloudinary.uploader.destroy(profile.profilePhotoPublicId).catch(() => {});
  }
  profile.profilePhotoUrl = '';
  profile.profilePhotoPublicId = '';
  await profile.save();
  res.json({ success: true, data: profile });
});

module.exports = { getProfile, updateProfile, updateProfilePhoto, deleteProfilePhoto };
