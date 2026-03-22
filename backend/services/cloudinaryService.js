const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Cloudinary Storage for Multer
 * This enables direct streaming of uploads to Cloudinary
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'interior-designer-portfolio',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4', 'webm'],
    resource_type: 'auto', // Automatically detect if it's an image or video
  },
});

module.exports = {
  cloudinary,
  storage,
};
