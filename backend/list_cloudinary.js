const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function listAssets() {
  console.log('🔍 Listing all assets in portfolio folder...');
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
      prefix: 'interior-designer-portfolio'
    });

    console.log(`Found ${result.resources.length} assets.`);
    result.resources.forEach(a => console.log(`- ${a.public_id}`));

  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

listAssets();
