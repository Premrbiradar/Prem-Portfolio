const buildCrudRouter = require('./crudRouteFactory');
const youtubeController = require('../controllers/youtubeController');
const { protect, requireAdmin } = require('../middleware/auth');
const { uploadImage, guardCloudinary } = require('../middleware/upload');

const router = buildCrudRouter(youtubeController);
const thumbUpload = uploadImage('youtube-thumbnails');

router.post(
  '/:id/thumbnail',
  protect,
  requireAdmin,
  guardCloudinary,
  thumbUpload.single('thumbnail'),
  youtubeController.uploadThumbnail
);

module.exports = router;
