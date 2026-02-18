// Seed script: run with node seed/projectsSeed.js (from backend folder)
// Requires: MONGO_URI in .env and backend dependencies installed

const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const Project = require("../models/Project");

const seedProjects = [
  {
    title: "Serene Coastal Living",
    description: "A light-filled living space blending natural materials with ocean views. Neutral tones and organic textures create a calm, sophisticated atmosphere. Features bespoke furniture and panoramic floor-to-ceiling windows.",
    location: "Mumbai, Bandra",
    roomType: "Living Room",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
    ],
    videos: ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"],
  },
  {
    title: "Eco-Friendly Modern Villa",
    description: "Sustainable luxury at its finest. This villa uses reclaimed wood, solar lighting, and indoor vertical gardens to create a breathable, modern sanctuary.",
    location: "Alibaug, Coastal Reach",
    roomType: "Full House",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
    ],
    videos: ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"],
  },
  {
    title: "Minimalist Bedroom Retreat",
    description: "Clean lines and a muted palette define this bedroom. Custom joinery and soft lighting make it a perfect retreat for rest and rejuvenation.",
    location: "Pune, Koregaon Park",
    roomType: "Bedroom",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200",
      "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=1200",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
    ],
    videos: ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"],
  },
  {
    title: "Open-Plan Kitchen & Dining",
    description: "An open kitchen and dining area with premium marble finishes. Island seating and natural light for everyday living and high-end entertaining.",
    location: "Bangalore, Indiranagar",
    roomType: "Kitchen",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200",
    ],
    videos: ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"],
  },
  {
    title: "Executive Home Office",
    description: "A dedicated home office with built-in shelving, ergonomic seating, and refined mahogany materials for focus and professional comfort.",
    location: "Delhi NCR",
    roomType: "Office",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200",
    ],
    videos: ["https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"],
  },
  {
    title: "Urban Loft Interior",
    description: "Industrial chic loft with exposed brick, high ceilings, and velvet accents. Perfect for the modern urban dweller.",
    location: "Hyderabad, HITEC City",
    roomType: "Living Room",
    featured: false,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
      "https://images.unsplash.com/photo-1536376074432-8e6a0d5af56b?w=1200",
    ],
    videos: [],
  },
  {
    title: "Luxury Hallway Concept",
    description: "A grand entrance hall featuring vaulted ceilings, custom lighting, and premium flooring.",
    location: "Hyderabad, Jubilee Hills",
    roomType: "Living Room",
    featured: true,
    images: [
      "/gallery/hall.jpeg",
      "/gallery/hall2.jpeg",
      "/gallery/ceiling.jpeg",
    ],
    videos: [],
  },
  {
    title: "Modern Minimalist Bedroom",
    description: "Clean lines and a soft color palette create a peaceful sleeping environment.",
    location: "Hyderabad, Banjara Hills",
    roomType: "Bedroom",
    featured: true,
    images: [
      "/gallery/bedroom1.jpeg",
      "/gallery/bedroom2.jpeg",
      "/gallery/bedroom3.jpeg",
    ],
    videos: [],
  },
  {
    title: "Gourmet Kitchen Suite",
    description: "A chef's dream with state-of-the-art appliances and marble countertops.",
    location: "Hyderabad, Gachibowli",
    roomType: "Kitchen",
    featured: true,
    images: [
      "/gallery/kitchen1.jpeg",
      "/gallery/kitchen2.jpeg",
    ],
    videos: [],
  },
  {
    title: "Complete Home Showcase",
    description: "A full walkthrough of our recently completed residential project.",
    location: "Hyderabad, Financial District",
    roomType: "Full House",
    featured: true,
    images: [
      "/gallery/living_room1.jpeg",
      "/gallery/bedroom4.jpeg",
      "/gallery/kitchen1.jpeg",
    ],
    videos: ["/gallery/full_house.mp4"],
  },
  {
    title: "Royal Grand Suite",
    description: "A master bedroom that redefines luxury. Velvet upholstery, gold leaf accents, and a custom-designed headboard create a regal sanctuary. Features a private lounging area and bespoke walk-in closet.",
    location: "Mumbai, Cuffe Parade",
    roomType: "Bedroom",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200",
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200",
      "https://images.unsplash.com/photo-1560185127-6a43058c0103?w=1200",
    ],
    videos: [],
  },
  {
    title: "Modern Minimalist Dining",
    description: "Sculptural furniture and a monochromatic palette define this dining space. A custom marble table serves as the centerpiece, illuminated by a signature designer chandelier.",
    location: "Bangalore, Lavelle Road",
    roomType: "Dining Room",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1534082101342-9993952f976a?w=1200",
      "https://images.unsplash.com/photo-1617806118233-f8e137ca7a2a?w=1200",
    ],
    videos: [],
  },
  {
    title: "Luxury Spa Bathroom",
    description: "Transforming the daily routine into a spa experience. Features a freestanding soaking tub, rainforest shower, and premium Italian marble finishes throughout.",
    location: "Chennai, Boat Club Road",
    roomType: "Bathroom",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200",
      "https://images.unsplash.com/photo-1507089947368-19c1ac977534?w=1200",
    ],
    videos: [],
  },
];

async function run() {
  if (!process.env.MONGO_URI) {
    console.error("Missing MONGO_URI in .env");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);
  await Project.deleteMany({});
  await Project.insertMany(seedProjects);
  console.log("Seeded", seedProjects.length, "projects");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

