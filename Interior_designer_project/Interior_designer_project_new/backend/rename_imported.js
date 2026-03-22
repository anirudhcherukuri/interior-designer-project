const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PREMIUM_NAMES = [
  "Regal Velvet Suite", "Milanese Loft Concept", "Marble Grand Foyer",
  "Zen Sanctuary Living", "Gold-Leaf Master Bedroom", "Contemporary Kitchen Suite",
  "Industrial Chic Office", "Royal Italian Hallway", "Minimalist Dream Lounge",
  "Sapphire Guest Retreat", "Opulent Dining Space", "Tuscan Villa View",
  "Emerald Accent Living", "Champagne Penthouse", "Art Deco Study",
  "Modern Heritage Full House", "Rustic Luxury Bedroom", "Pacific Blue Lounge",
  "Pearl White Kitchen", "Terra Cotta Terrace View", "Velvet Dusk Hallway",
  "Crystal Clear Dining", "Obsidian Master Suite", "Ivory Coast Living"
];

async function renameExisting() {
  console.log('🔍 Fetching assets for premium rebranding...');
  try {
    const result = await cloudinary.api.resources({
      type: 'upload', max_results: 500, context: true, tags: true
    });

    const assetsToUpdate = result.resources.filter(asset => 
      asset.public_id.includes('interior-designer-portfolio')
    );

    console.log(`🚀 Rebranding ${assetsToUpdate.length} images with premium names...`);

    for (const [index, asset] of assetsToUpdate.entries()) {
      const nameBase = PREMIUM_NAMES[index % PREMIUM_NAMES.length];
      const title = `${nameBase} ${Math.floor(index / PREMIUM_NAMES.length) + 1}`;
      
      console.log(`Updating: "${title}"...`);
      
      await cloudinary.api.update(asset.public_id, {
        context: {
          title: title,
          description: `Bespoke ${nameBase.toLowerCase()} designed for ultimate luxury and comfort. Focus on premium materials and lighting.`,
          roomType: nameBase.includes('Bedroom') ? 'Bedroom' : 
                    nameBase.includes('Kitchen') ? 'Kitchen' : 
                    nameBase.includes('Living') ? 'Living Room' : 'Full House',
          location: 'Hyderabad, India'
        },
        tags: ['imported', 'social-media', 'featured', 'hyderabad-luxury']
      });
    }

    console.log('\n✨ All photos have been successfully rebranded with unique premium names!');
  } catch (err) {
    console.error('❌ Rebranding Error:', err.message);
  }
}

renameExisting();
