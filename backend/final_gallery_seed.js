const cloudinary = require('cloudinary').v2;

// User's provided credentials from Step 1343
cloudinary.config({
  cloud_name: 'dbtovbomo',
  api_key: '874197112946991',
  api_secret: 'E1UYatB2GMZvi46Npe150gM6UMM',
});

const samples = [
  // ─── GENERATED IMAGES (Premium) ──────────────────────────────────────────
  {
    path: 'C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\modern_living_room_luxury_1774164064346.png',
    title: 'Contemporary Italian Living',
    description: 'Emerald velvet and marble living space.',
    roomType: 'Living Room',
    public_id: 'interior-designer-portfolio/luxe-living-1'
  },
  {
    path: 'C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\master_bedroom_minimalist_luxury_1774164079932.png',
    title: 'Minimalist Master Suite',
    description: 'Serene Italian minimal bedroom.',
    roomType: 'Bedroom',
    public_id: 'interior-designer-portfolio/luxe-bedroom-1'
  },
  {
    path: 'C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\gourmet_kitchen_marble_island_1774164098460.png',
    title: 'Gourmet Marble Kitchen',
    description: 'Chef-grade kitchen with massive marble island.',
    roomType: 'Kitchen',
    public_id: 'interior-designer-portfolio/luxe-kitchen-1'
  },
  {
    path: 'C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\elegant_dining_room_chandelier_1774164113595.png',
    title: 'The Crystal Dining Room',
    description: 'Grand dining with bespoke lighting.',
    roomType: 'Dining Room',
    public_id: 'interior-designer-portfolio/luxe-dining-1'
  },
  {
    path: 'C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\luxury_bathroom_spa_retreat_1774164129114.png',
    title: 'Spa-Like Marble Retreat',
    description: 'Freestanding stone tub and marble finishes.',
    roomType: 'Bathroom',
    public_id: 'interior-designer-portfolio/luxe-bathroom-1'
  },
  {
    path: 'C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\premium_living_emerald_1774165752806.png',
    title: 'Velvet Emerald Lounge',
    description: 'Luxurious velvet seating in a bright modern space.',
    roomType: 'Living Room',
    public_id: 'interior-designer-portfolio/luxe-living-2'
  },
  {
    path: 'C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\modern_kitchen_slate_1774165777561.png',
    title: 'Sleek Slate Kitchen',
    description: 'Modern slate gray and marble masterpiece.',
    roomType: 'Kitchen',
    public_id: 'interior-designer-portfolio/luxe-kitchen-2'
  },
  {
    path: 'C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\minimal_bedroom_loft_1774165794461.png',
    title: 'Industrial Loft Sanctuary',
    description: 'Concrete and warm wood minimalist bedroom.',
    roomType: 'Bedroom',
    public_id: 'interior-designer-portfolio/luxe-bedroom-2'
  },
  {
    path: 'C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\dining_crystal_modern_1774165822778.png',
    title: 'Oak & Crystal Dining',
    description: 'Stunning oak table with modern crystal chandelier.',
    roomType: 'Dining Room',
    public_id: 'interior-designer-portfolio/luxe-dining-2'
  },
  {
    path: 'C:\\Users\\vamsh\\.gemini\\antigravity\\brain\\64d8bb5f-39a1-4fff-a4b7-911bb93cac3d\\bathroom_marble_sunlight_1774165836904.png',
    title: 'Sunlit Marble Bathroom',
    description: 'Bright luxury bathroom with a massive skylight.',
    roomType: 'Bathroom',
    public_id: 'interior-designer-portfolio/luxe-bathroom-2'
  }
];

async function finalGallerySeed() {
  try {
    console.log('🧹 Purging folder "interior-designer-portfolio/"...');
    const listResult = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'interior-designer-portfolio', 
      max_results: 500
    });
    
    if (listResult.resources.length > 0) {
      const publicIds = listResult.resources.map(r => r.public_id);
      await cloudinary.api.delete_resources(publicIds);
      console.log(`✅ Cleaned up ${publicIds.length} old items.`);
    }

    console.log('🚀 Uploading 10 Stunning NEW Portfolio Projects...');
    for (const item of samples) {
      console.log(`Uploading: ${item.title}...`);
      await cloudinary.uploader.upload(item.path, {
        public_id: item.public_id,
        overwrite: true,
        context: {
          title: item.title,
          description: item.description,
          roomType: item.roomType,
          location: 'Milan, Italy'
        },
        tags: ['featured', item.roomType.toLowerCase().replace(/\s+/g, '-')]
      });
      console.log(`✅ Successfully seeded: ${item.title}`);
    }

    console.log('\n✨ GALLERY SEED COMPLETE! Your 10 luxury projects are now in Cloudinary.');
  } catch (err) {
    console.error('❌ Error during seeding:', err.message);
  }
}

finalGallerySeed();
