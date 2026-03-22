const express = require('express');
const router = express.Router();
const { cloudinary } = require('../services/cloudinaryService');
const auth = require('../middleware/authMiddleware');

// GET all projects from Cloudinary as the source of truth
router.get("/", async (req, res) => {
  try {
    // Fetch resources with context from Cloudinary (using prefix but without strict trailing slash)
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'interior-designer-portfolio', 
      max_results: 100,
      context: true,
      tags: true
    });

    const projects = result.resources.map(asset => {
      // Handle context with fallback to top-level if custom is missing
      const context = (asset.context && asset.context.custom) || asset.context || {};
      
      return {
        _id: asset.public_id,
        title: context.title || 'Portfolio Project',
        description: context.description || '',
        roomType: context.roomType || 'Living Room',
        location: context.location || 'Hyderabad, India',
        images: [asset.secure_url], // Return as array for compatibility
        videos: [],
        imageUrl: asset.secure_url,
        thumbnailUrl: asset.secure_url.replace('/upload/', '/upload/w_400,c_fill,g_auto/'),
        tags: asset.tags || [],
        featured: asset.tags ? asset.tags.includes('featured') : false
      };
    });

    // If query param ?featured=true, filter them
    if (req.query.featured === 'true') {
      return res.json(projects.filter(p => p.featured));
    }

    res.json(projects);
  } catch (err) {
    console.error('Cloudinary Fetch Error:', err.message);
    res.status(500).json({ error: "Could not fetch portfolio from Cloudinary" });
  }
});

// GET single project metadata (mocked from Cloudinary as well)
router.get("/:id", async (req, res) => {
  try {
    const asset = await cloudinary.api.resource(req.params.id, { context: true, tags: true });
    
    const project = {
      id: asset.public_id,
      title: (asset.context && asset.context.custom && asset.context.custom.title) || 'Portfolio Item',
      description: (asset.context && asset.context.custom && asset.context.custom.description) || '',
      roomType: (asset.context && asset.context.custom && asset.context.custom.roomType) || 'Gallery',
      imageUrl: asset.secure_url,
      tags: asset.tags || [],
      createdAt: asset.created_at
    };
    
    res.json(project);
  } catch (err) {
    res.status(404).json({ error: "Project not found" });
  }
});

// POST/PUT/DELETE are handled by uploadRoutes for simplicity since Cloudinary is the store
router.post("/", auth, (req, res) => {
  res.status(405).json({ error: "Use /api/upload for adding projects to the Cloudinary store" });
});

module.exports = router;
