require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const samples = [
  {
    url: 'https://images.unsplash.com/photo-1616489953149-756157835f8d?auto=format&fit=crop&q=80&w=1000',
    title: 'Modern Master Bedroom',
    description: 'A serene and luxurious master bedroom with minimalist Italian furniture.',
    roomType: 'Bedroom',
    public_id: 'interior-designer-portfolio/sample-bedroom'
  },
  {
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000',
    title: 'European Living Space',
    description: 'Open-concept living room with custom gold accents and floor-to-ceiling windows.',
    roomType: 'Living Room',
    public_id: 'interior-designer-portfolio/sample-living'
  },
  {
    url: 'https://images.unsplash.com/photo-1556911220-e150213483de?auto=format&fit=crop&q=80&w=1000',
    title: 'Gourmet Italian Kitchen',
    description: 'A professional-grade kitchen featuring marble countertops and built-in appliances.',
    roomType: 'Kitchen',
    public_id: 'interior-designer-portfolio/sample-kitchen'
  }
];

async function seedCloudinary() {
  console.log('🚀 Seeding demo images to Cloudinary...');
  
  for (const item of samples) {
    try {
      console.log(`Uploading: ${item.title}...`);
      await cloudinary.uploader.upload(item.url, {
        public_id: item.public_id,
        overwrite: true,
        context: {
          title: item.title,
          description: item.description,
          roomType: item.roomType,
          location: 'Milan, Italy'
        },
        tags: ['featured', item.roomType.toLowerCase()]
      });
      console.log(`✅ Success: ${item.title}`);
    } catch (e) {
      console.error(`❌ Failed: ${item.title}`, e.message);
    }
  }
  
  console.log('\n✨ Seeding Complete! Refresh your website now.');
}

seedCloudinary();
