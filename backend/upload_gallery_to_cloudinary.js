const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// User's Cloudinary credentials
cloudinary.config({
  cloud_name: 'dbtovbomo',
  api_key: '874197112946991',
  api_secret: 'E1UYatB2GMZvi46Npe150gM6UMM',
});

const GALLERY_DIR = path.join(__dirname, '../frontend/build/gallery');

// Map filename patterns to room types
function getRoomType(filename) {
  const f = filename.toLowerCase();
  if (f.includes('bedroom')) return 'Bedroom';
  if (f.includes('living_room') || f.includes('livingroom') || f.includes('hall')) return 'Living Room';
  if (f.includes('kitchen')) return 'Kitchen';
  if (f.includes('cupboard')) return 'Wardrobe';
  if (f.includes('dining')) return 'Dining Room';
  if (f.includes('bathroom') || f.includes('bath')) return 'Bathroom';
  if (f.includes('pooja')) return 'Pooja Room';
  if (f.includes('ceiling')) return 'False Ceiling';
  if (f.includes('bg')) return 'Living Room';
  return 'Interior';
}

function getTitle(filename) {
  const base = path.basename(filename, path.extname(filename));
  return base.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

async function uploadAll() {
  // First clear old uploads
  console.log('🧹 Clearing old items from interior-designer-portfolio...');
  try {
    const existing = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'interior-designer-portfolio',
      max_results: 500
    });
    if (existing.resources.length > 0) {
      const ids = existing.resources.map(r => r.public_id);
      await cloudinary.api.delete_resources(ids);
      console.log(`✅ Deleted ${ids.length} old items.`);
    }
  } catch (e) {
    console.log('ℹ️ Nothing to delete or error:', e.message);
  }

  // Read all gallery images
  const files = fs.readdirSync(GALLERY_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  console.log(`🚀 Uploading ${files.length} gallery images to Cloudinary...`);

  let success = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = path.join(GALLERY_DIR, file);
    const roomType = getRoomType(file);
    const title = getTitle(file);
    const publicId = 'interior-designer-portfolio/' + path.basename(file, path.extname(file));

    try {
      await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        context: {
          title: title,
          description: `Premium ${roomType} interior design by Milan Interiors.`,
          roomType: roomType,
          location: 'Hyderabad, India'
        },
        tags: ['featured', roomType.toLowerCase().replace(/\s+/g, '-')]
      });
      console.log(`✅ [${++success}/${files.length}] ${file} → ${roomType}`);
    } catch (e) {
      console.error(`❌ Failed: ${file} — ${e.message}`);
      failed++;
    }
  }

  console.log(`\n✨ DONE! Uploaded: ${success}, Failed: ${failed}`);
  console.log('Your gallery is now live on Cloudinary!');
}

uploadAll();
