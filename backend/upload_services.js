const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Cloudinary credentials from .env
cloudinary.config({
  cloud_name: 'dbtovbomo',
  api_key: '874197112946991',
  api_secret: 'E1UYatB2GMZvi46Npe150gM6UMM',
});

const IMAGES = [
  { name: 'service_residential', path: 'C:/Users/vamsh/.gemini/antigravity/brain/e4b7357c-1a07-4271-8300-26dfdfcaae02/service_residential_modern_orange_natural_v2_1774251512432.png' },
  { name: 'service_commercial', path: 'C:/Users/vamsh/.gemini/antigravity/brain/e4b7357c-1a07-4271-8300-26dfdfcaae02/service_commercial_natural_premium_1774251384723.png' },
  { name: 'service_luxury', path: 'C:/Users/vamsh/.gemini/antigravity/brain/e4b7357c-1a07-4271-8300-26dfdfcaae02/service_luxury_classical_natural_v2_1774251494039.png' },
  { name: 'service_consultation', path: 'C:/Users/vamsh/.gemini/antigravity/brain/e4b7357c-1a07-4271-8300-26dfdfcaae02/service_consultation_natural_premium_1774251402355.png' },
];

async function upload() {
  console.log('🚀 Final upload for natural service images...');
  const results = {};
  
  for (const img of IMAGES) {
    try {
      const res = await cloudinary.uploader.upload(img.path, {
        public_id: `services/${img.name}_natural`,
        folder: 'interior-designer-portfolio/services',
        overwrite: true
      });
      results[img.name] = res.secure_url;
      console.log(`✅ ${img.name} uploaded!`);
    } catch (e) {
      console.error(`❌ ${img.name} failed:`, e.message);
    }
  }
  
  console.log('\nFinal URLs:');
  console.log(JSON.stringify(results, null, 2));
}

upload();
