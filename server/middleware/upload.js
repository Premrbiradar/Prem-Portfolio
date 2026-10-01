const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const {
  cloudinary,
  isCloudinaryConfigured,
} = require('../config/cloudinary');

const ApiError = require('../utils/ApiError');

// -----------------------------------------------------
// Cloudinary Storage
// -----------------------------------------------------

const buildStorage = (folder, resourceType = 'image') => {
  const params = {
    folder: `prem-portfolio/${folder}`,
    resource_type: resourceType,
  };

  // Only apply image transformations to images
  if (resourceType === 'image') {
    params.transformation = [
      {
        quality: 'auto',
        fetch_format: 'auto',
      },
    ];
  }

  return new CloudinaryStorage({
    cloudinary,
    params,
  });
};

// -----------------------------------------------------
// Fallback memory storage
// -----------------------------------------------------

const memoryStorage = multer.memoryStorage();

// -----------------------------------------------------
// Cloudinary guard
// -----------------------------------------------------

const guardCloudinary = (req, res, next) => {
  if (!isCloudinaryConfigured) {
    return next(
      new ApiError(
        503,
        'Cloudinary storage is not configured. Please check CLOUDINARY_* environment variables.'
      )
    );
  }

  next();
};

// -----------------------------------------------------
// Image upload
// -----------------------------------------------------

const uploadImage = (folder) =>
  multer({
    storage: isCloudinaryConfigured
      ? buildStorage(folder, 'image')
      : memoryStorage,

    limits: {
      fileSize: 5 * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
      ];

      if (!allowedTypes.includes(file.mimetype)) {
        return cb(
          new ApiError(
            400,
            'Only JPG, JPEG, PNG and WEBP images are allowed.'
          )
        );
      }

      cb(null, true);
    },
  });

// -----------------------------------------------------
// Resume PDF upload
// -----------------------------------------------------

const uploadResume = multer({
  storage: isCloudinaryConfigured
    ? buildStorage('resumes', 'raw')
    : memoryStorage,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(
        new ApiError(
          400,
          'Resume must be a PDF file.'
        )
      );
    }

    cb(null, true);
  },
});

// -----------------------------------------------------

module.exports = {
  uploadImage,
  uploadResume,
  guardCloudinary,
};