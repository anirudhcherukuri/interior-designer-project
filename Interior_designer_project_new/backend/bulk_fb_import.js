const fs = require('fs');
const path = require('path');
const os = require('os');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DOWNLOADS_DIR = path.join(os.homedir(), 'Downloads');
const TARGET_PREFIX = 'interior-designer-portfolio/imported-fb-';

async function bulkImport() {
  console.log('🔍 Scanning Downloads for FB media...');
  
  const files = fs.readdirSync(DOWNLOADS_DIR);
  
  // Pattern 1: Facebook naming (e.g., digits..._n.jpg)
  // Pattern 2: WhatsApp naming (e.g., WhatsApp Image...)
  const fbFiles = files.filter(f => 
    /\d+(_\d+)+_n\.(jpg|jpeg)$/i.test(f) || 
    f.toLowerCase().includes('whatsapp image')
  ).slice(40); // Process the remaining images after the first 40

  if (fbFiles.length === 0) {
    console.log('❌ No matching FB/WhatsApp images found in Downloads.');
    return;
  }

  console.log(`🚀 Found ${fbFiles.length} images. Starting Cloudinary upload...`);

  for (const [index, fileName] of fbFiles.entries()) {
    try {
      const filePath = path.join(DOWNLOADS_DIR, fileName);
      console.log(`[${index + 1}/${fbFiles.length}] Uploading: ${fileName}...`);
      
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: `${TARGET_PREFIX}${Date.now()}-${index}`,
        folder: 'interior-designer-portfolio',
        context: {
          title: `Mumbai House Showcase ${index + 1}`,
          description: `Premium interior photography from our Mumbai project - ${fileName}`,
          roomType: 'Full House',
          location: 'Mumbai, India'
        },
        tags: ['imported', 'social-media']
      });
      
      console.log(`✅ Success: ${result.secure_url}`);
    } catch (err) {
      console.error(`❌ Failed: ${fileName} - ${err.message}`);
    }
  }

  console.log('\n✨ Import Complete! The images will now appear in your Portfolio and Gallery.');
}

bulkImport();
