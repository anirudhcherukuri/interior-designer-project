// Seed script: run with node seed/projectsSeed.js (from backend folder)
// Requires: MONGO_URI in .env and backend dependencies installed

const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const Project = require("../models/Project");

const seedProjects = [
  {
    title: "Serene Coastal Living",
    description: "A light-filled living space blending natural materials with ocean views. Neutral tones and organic textures create a calm, sophisticated atmosphere.",
    location: "Mumbai, Bandra",
    roomType: "Living Room",
    featured: true,
    images: [
      "/gallery/living_room1.jpeg",
      "/gallery/living_room2.jpeg",
      "/gallery/hall.jpeg",
      "/gallery/ceiling.jpeg"
    ],
    videos: [],
  },
  {
    title: "Eco-Friendly Modern Villa",
    description: "Sustainable luxury at its finest. This villa uses reclaimed wood, solar lighting, and indoor vertical gardens.",
    location: "Alibaug, Coastal Reach",
    roomType: "Full House",
    featured: true,
    images: [
      "/gallery/hall.jpeg",
      "/gallery/hall2.jpeg",
      "/gallery/living_room3.jpeg"
    ],
    videos: ["/gallery/full_house.mp4"],
  },
  {
    title: "Minimalist Bedroom Retreat",
    description: "Clean lines and a muted palette define this bedroom. Custom joinery and soft lighting make it a perfect retreat.",
    location: "Pune, Koregaon Park",
    roomType: "Bedroom",
    featured: true,
    images: [
      "/gallery/bedroom1.jpeg",
      "/gallery/bedroom2.jpeg",
      "/gallery/bedroom3.jpeg"
    ],
    videos: [],
  },
  {
    title: "Open-Plan Kitchen & Dining",
    description: "An open kitchen and dining area with premium marble finishes. Island seating and natural light for everyday living.",
    location: "Bangalore, Indiranagar",
    roomType: "Kitchen",
    featured: true,
    images: [
      "/gallery/kitchen1.jpeg",
      "/gallery/kitchen2.jpeg",
      "/gallery/living_room4.jpeg"
    ],
    videos: [],
  },
  {
    title: "Executive Home Office",
    description: "A dedicated home office with built-in shelving and refined mahogany materials for focus.",
    location: "Delhi NCR",
    roomType: "Office",
    featured: false,
    images: [
      "/gallery/living_room5.jpeg",
      "/gallery/hall2.jpeg",
      "/gallery/ceiling.jpeg"
    ],
    videos: [],
  },
  {
    title: "Urban Loft Interior",
    description: "Industrial chic loft with exposed brick and high ceilings. Perfect for the modern urban dweller.",
    location: "Hyderabad, HITEC City",
    roomType: "Living Room",
    featured: false,
    images: [
      "/gallery/living_room3.jpeg",
      "/gallery/living_room4.jpeg"
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
      "/gallery/ceiling.jpeg"
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
      "/gallery/bedroom4.jpeg",
      "/gallery/bedroom5.jpeg",
      "/gallery/bedroom1.jpeg"
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
      "/gallery/kitchen2.jpeg",
      "/gallery/kitchen1.jpeg"
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
      "/gallery/hall.jpeg",
      "/gallery/bedroom1.jpeg",
      "/gallery/kitchen1.jpeg"
    ],
    videos: ["/gallery/full_house.mp4"],
  },
  {
    title: "Royal Grand Suite",
    description: "A master bedroom that redefines luxury. Velvet upholstery and gold leaf accents.",
    location: "Mumbai, Cuffe Parade",
    roomType: "Bedroom",
    featured: true,
    images: [
      "/gallery/bedroom5.jpeg",
      "/gallery/bedroom3.jpeg",
      "/gallery/bedroom2.jpeg"
    ],
    videos: [],
  },
  {
    title: "Modern Minimalist Dining",
    description: "Sculptural furniture and a monochromatic palette define this dining space.",
    location: "Bangalore, Lavelle Road",
    roomType: "Dining Room",
    featured: true,
    images: [
      "/gallery/hall2.jpeg",
      "/gallery/living_room1.jpeg"
    ],
    videos: [],
  },
  {
    title: "Luxury Spa Bathroom",
    description: "Transforming the daily routine into a spa experience. Premium Italian marble finishes.",
    location: "Chennai, Boat Club Road",
    roomType: "Bathroom",
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200", // Keeping unsplash for bathroom as no local img
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200",
      "/gallery/ceiling.jpeg"
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
