const express = require('express');
const buildCrudRouter = require('./crudRouteFactory');
const projectController = require('../controllers/projectController');
const { protect, requireAdmin } = require('../middleware/auth');
const { uploadImage, guardCloudinary } = require('../middleware/upload');

const router = buildCrudRouter(projectController);
const imageUpload = uploadImage('projects');

router.post(
  '/:id/image',
  protect,
  requireAdmin,
  guardCloudinary,
  imageUpload.single('image'),
  projectController.uploadProjectImage
);

module.exports = router;
