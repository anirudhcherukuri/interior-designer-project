require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { cloudinary } = require('./services/cloudinaryService');

/**
 * Migration Script: Local Images -> Cloudinary
 * This will take images from frontend/public/gallery and upload them to Cloudinary.
 */

const GALLERY_DIR = path.join(__dirname, '../frontend/public/gallery');

async function migrateImages() {
  console.log('🚀 Starting Migration to Cloudinary...');
  
  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
    console.error('❌ Error: Cloudinary credentials not set in .env');
    return;
  }

  if (!fs.existsSync(GALLERY_DIR)) {
    console.error(`❌ Error: Gallery directory not found at ${GALLERY_DIR}`);
    return;
  }

  const files = fs.readdirSync(GALLERY_DIR).filter(file => 
    ['.jpg', '.jpeg', '.png', '.webp', '.mp4'].includes(path.extname(file).toLowerCase())
  );

  console.log(`Found ${files.length} files to migrate.`);

  for (const file of files) {
    const filePath = path.join(GALLERY_DIR, file);
    const publicId = `gallery/${path.parse(file).name}`;

    try {
      console.log(`Uploading ${file}...`);
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        folder: 'interior-designer-portfolio/gallery',
        resource_type: 'auto'
      });
      console.log(`✅ Success: ${file} -> ${result.secure_url}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error.message);
    }
  }

  console.log('✨ Migration Complete!');
}

migrateImages();
