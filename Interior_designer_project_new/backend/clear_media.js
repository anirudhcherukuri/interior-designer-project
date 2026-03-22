const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function clearCloudinary() {
  console.log('🔍 Fetching all assets to clear gallery...');
  try {
    console.log(`🗑️ Deleting all assets in folder: interior-designer-portfolio`);
    
    const deleteResult = await cloudinary.api.delete_resources_by_prefix('interior-designer-portfolio');
    console.log('✨ Cleanup Result:', JSON.stringify(deleteResult, null, 2));

  } catch (err) {
    console.error('❌ Cleanup Error:', err);
  }
}

clearCloudinary();
