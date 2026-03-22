const cloudinary = require('cloudinary').v2;

// User's provided credentials
cloudinary.config({
  cloud_name: 'dbtovbomo',
  api_key: '874197112946991',
  api_secret: 'E1UYatB2GMZvi46Npe150gM6UMM',
});

const samples = [
  {
    path: 'C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\modern_living_room_luxury_1774164064346.png',
    title: 'Modern Luxe Living',
    description: 'Bespoke contemporary living room with marble accents.',
    roomType: 'Living Room',
    public_id: 'interior-designer-portfolio/modern-living'
  },
  {
    path: 'C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\master_bedroom_minimalist_luxury_1774164079932.png',
    title: 'Minimalist Sanctuary',
    description: 'Serene master suite with Italian-inspired minimal design.',
    roomType: 'Bedroom',
    public_id: 'interior-designer-portfolio/master-bedroom'
  },
  {
    path: 'C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\gourmet_kitchen_marble_island_1774164098460.png',
    title: 'Chef’s Gourmet Kitchen',
    description: 'Marble island and custom cabinetry for professional culinary experiences.',
    roomType: 'Kitchen',
    public_id: 'interior-designer-portfolio/gourmet-kitchen'
  },
  {
    path: 'C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\elegant_dining_room_chandelier_1774164113595.png',
    title: 'The Crystal Dining Room',
    description: 'Grand dining hall featuring a massive bespoke chandelier.',
    roomType: 'Dining Room',
    public_id: 'interior-designer-portfolio/elegant-dining'
  },
  {
    path: 'C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\luxury_bathroom_spa_retreat_1774164129114.png',
    title: 'Royal Spa Retreat',
    description: 'Freestanding tub and marble finishes for a personal spa experience.',
    roomType: 'Bathroom',
    public_id: 'interior-designer-portfolio/luxury-bathroom'
  },
  // Adding Unsplash high-quality samples
  {
    path: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000',
    title: 'European Loft Living',
    description: 'Open-concept loft with industrial accents and warm lighting.',
    roomType: 'Living Room',
    public_id: 'interior-designer-portfolio/loft-living'
  },
  {
    path: 'https://images.unsplash.com/photo-1616137422495-1e9e47e217c2?q=80&w=2000',
    title: 'Italian Villa Bedroom',
    description: 'Classic European bedroom with ornate ceiling and silk textiles.',
    roomType: 'Bedroom',
    public_id: 'interior-designer-portfolio/villa-bedroom'
  },
  {
    path: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2000',
    title: 'Modern Terrace Dining',
    description: 'Outdoor-indoor dining space with panoramic city views.',
    roomType: 'Dining Room',
    public_id: 'interior-designer-portfolio/terrace-dining'
  }
];

async function purgeAndSeed() {
  try {
    console.log('🧹 Purging all existing images in "interior-designer-portfolio/" folder...');
    // Clear the folder first
    const listResult = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'interior-designer-portfolio/',
      max_results: 500
    });
    
    if (listResult.resources.length > 0) {
      const publicIds = listResult.resources.map(r => r.public_id);
      await cloudinary.api.delete_resources(publicIds);
      console.log(`✅ Deleted ${publicIds.length} old images.`);
    } else {
      console.log('ℹ️ No images to delete.');
    }

    console.log('🚀 Seeding 5 NEW high-end designer images...');
    for (const item of samples) {
      console.log(`Uploading: ${item.title}...`);
      await cloudinary.uploader.upload(item.path, {
        public_id: item.public_id,
        overwrite: true,
        context: {
          title: item.title,
          description: item.description,
          roomType: item.roomType,
          location: 'Jubilee Hills, Hyderabad'
        },
        tags: ['featured', item.roomType.toLowerCase().replace(/\s+/g, '-')]
      });
      console.log(`✅ Success: ${item.title}`);
    }

    console.log('\n✨ DONE! Cloudinary is now cleaned and seeded with premium work.');
  } catch (err) {
    console.error('❌ CRITICAL ERROR:', err.message);
  }
}

purgeAndSeed();
