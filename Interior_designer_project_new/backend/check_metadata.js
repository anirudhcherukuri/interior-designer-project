const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function checkMetadata() {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: 5,
      prefix: 'interior-designer-portfolio',
      context: true
    });

    console.log('--- METADATA CHECK ---');
    result.resources.forEach(a => {
      console.log(`ID: ${a.public_id}`);
      console.log(`Title: ${a.context?.custom?.title || 'N/A'}`);
      console.log(`Location: ${a.context?.custom?.location || 'N/A'}`);
      console.log('---');
    });
  } catch (err) {
    console.error(err);
  }
}

checkMetadata();
