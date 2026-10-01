const asyncHandler = require('express-async-handler');
const Resume = require('../models/Resume');
const Profile = require('../models/Profile');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

// GET /api/resume (public) — returns the currently active resume, if any.
const getActiveResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ isActive: true }).sort({ createdAt: -1 });
  res.json({ success: true, data: resume || null });
});

// GET /api/resume/all (admin)
const listResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find().sort({ createdAt: -1 });
  res.json({ success: true, data: resumes });
});

// POST /api/resume (admin) — uploads a new resume and makes it the active one.
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No PDF file received.');

  await Resume.updateMany({}, { isActive: false });
  const resume = await Resume.create({
    fileUrl: req.file.path,
    filePublicId: req.file.filename || '',
    fileName: req.file.originalname,
    isActive: true,
  });

  const profile = (await Profile.findOne()) || (await Profile.create({}));
  profile.resumeUrl = resume.fileUrl;
  await profile.save();

  res.status(201).json({ success: true, data: resume });
});

// PATCH /api/resume/:id/activate (admin)
const setActiveResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) throw new ApiError(404, 'Resume not found.');

  await Resume.updateMany({}, { isActive: false });
  resume.isActive = true;
  await resume.save();

  const profile = (await Profile.findOne()) || (await Profile.create({}));
  profile.resumeUrl = resume.fileUrl;
  await profile.save();

  res.json({ success: true, data: resume });
});

// DELETE /api/resume/:id (admin)
const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) throw new ApiError(404, 'Resume not found.');

  if (isCloudinaryConfigured && resume.filePublicId) {
    await cloudinary.uploader.destroy(resume.filePublicId, { resource_type: 'raw' }).catch(() => {});
  }
  await resume.deleteOne();

  const profile = await Profile.findOne();
  if (profile && profile.resumeUrl === resume.fileUrl) {
    profile.resumeUrl = '';
    await profile.save();
  }

  res.json({ success: true, data: {} });
});

module.exports = { getActiveResume, listResumes, uploadResume, setActiveResume, deleteResume };
