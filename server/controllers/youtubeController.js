const asyncHandler = require('express-async-handler');
const YoutubeVideo = require('../models/YoutubeVideo');
const buildCrudController = require('./crudFactory');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

const base = buildCrudController(YoutubeVideo, { defaultSort: { order: 1, createdAt: -1 } });

// POST /api/youtube/:id/thumbnail (admin) — optional custom thumbnail;
// otherwise the frontend falls back to YouTube's own thumbnail for the URL.
const uploadThumbnail = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No image file received.');
  const video = await YoutubeVideo.findById(req.params.id);
  if (!video) throw new ApiError(404, 'Video not found.');

  if (isCloudinaryConfigured && video.thumbnailPublicId) {
    await cloudinary.uploader.destroy(video.thumbnailPublicId).catch(() => {});
  }
  video.thumbnailUrl = req.file.path;
  video.thumbnailPublicId = req.file.filename || '';
  await video.save();

  res.json({ success: true, data: video });
});

module.exports = { ...base, uploadThumbnail };
