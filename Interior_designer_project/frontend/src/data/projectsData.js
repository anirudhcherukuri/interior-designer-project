// Client Projects - Your Interior Design Portfolio
// Add your photos to: frontend/public/gallery/
// Then add the paths below in the format: '/gallery/your-photo-name.jpg'

export const mockProjects = [
  // Living Room Projects
  {
    _id: 'living-room-showcase',
    title: 'Elegant Living Spaces',
    description: 'Modern living room design featuring contemporary furniture, premium finishes, and sophisticated color schemes that create a warm and inviting atmosphere.',
    location: 'Client Project - Hyderabad',
    roomType: 'Living Room',
    featured: true,
    images: [
      '/gallery/living_room1.jpeg',
      '/gallery/living_room2.jpeg',
      '/gallery/living_room3.jpeg',
      '/gallery/living_room4.jpeg',
      '/gallery/living_room5.jpeg',
      '/gallery/hall.jpeg',
      '/gallery/hall2.jpeg',
    ],
    videos: [],
  },

  // Bedroom Projects
  {
    _id: 'bedroom-collection',
    title: 'Serene Bedroom Retreats',
    description: 'Luxurious bedroom designs with custom wardrobes, elegant lighting, and carefully curated decor elements for ultimate comfort and style.',
    location: 'Client Project - Hyderabad',
    roomType: 'Bedroom',
    featured: true,
    images: [
      '/gallery/bedroom1.jpeg',
      '/gallery/bedroom2.jpeg',
      '/gallery/bedroom3.jpeg',
      '/gallery/bedroom4.jpeg',
      '/gallery/bedroom5.jpeg',
    ],
    videos: [],
  },

  // Kitchen Project
  {
    _id: 'modern-kitchen',
    title: 'Contemporary Kitchen Design',
    description: 'Functional and stylish kitchen with modern cabinetry, efficient layout, and premium appliances. Perfect blend of aesthetics and practicality.',
    location: 'Client Project - Hyderabad',
    roomType: 'Kitchen',
    featured: true,
    images: [
      '/gallery/kitchen1.jpeg',
      '/gallery/kitchen2.jpeg',
    ],
    videos: [],
  },

  // Full House Walkthrough
  {
    _id: 'full-house-walkthrough',
    title: 'Complete Home Interior',
    description: 'A comprehensive interior design project showcasing our complete home transformation. From concept to completion, featuring custom furniture, lighting design, and premium finishes throughout.',
    location: 'Client Project - Hyderabad',
    roomType: 'Full House',
    featured: false,
    images: [
      '/gallery/living_room1.jpeg',
      '/gallery/bedroom1.jpeg',
      '/gallery/kitchen1.jpeg',
      '/gallery/hall.jpeg',
    ],
    videos: [
      '/gallery/full_house.mp4',
    ],
  },
];
