require('dotenv').config();
const { cloudinary } = require('./services/cloudinaryService');

async function checkMedia() {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'interior-designer-portfolio/',
      max_results: 100,
      context: true
    });
    console.log('✅ Found', result.resources.length, 'resources in Cloudinary');
    console.log(JSON.stringify(result.resources.map(r => ({
      public_id: r.public_id,
      url: r.secure_url,
      context: r.context ? r.context.custom : null
    })), null, 2));
  } catch (err) {
    console.error('❌ Error fetching from Cloudinary:', err.message);
  }
}

checkMedia();
