const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');
const buildCrudController = require('./crudFactory');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

const base = buildCrudController(Project, { defaultSort: { order: 1, createdAt: -1 } });

// POST /api/projects/:id/image (admin) — attach/replace a project's image.
const uploadProjectImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No image file received.');
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, 'Project not found.');

  if (isCloudinaryConfigured && project.imagePublicId) {
    await cloudinary.uploader.destroy(project.imagePublicId).catch(() => {});
  }
  project.imageUrl = req.file.path;
  project.imagePublicId = req.file.filename || '';
  await project.save();

  res.json({ success: true, data: project });
});

module.exports = { ...base, uploadProjectImage };
