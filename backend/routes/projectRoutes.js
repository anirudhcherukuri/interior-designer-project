const express = require('express');
const router = express.Router();
const { cloudinary } = require('../services/cloudinaryService');
const jsonDb = require('../utils/jsonDb');
const auth = require('../middleware/authMiddleware');

// GET all projects - Merge Cloudinary with JSON DB
router.get("/", async (req, res) => {
  try {
    const localProjects = jsonDb.get('projects') || [];
    
    let cloudinaryProjects = [];
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'interior-designer-portfolio', 
        max_results: 100,
        context: true,
        tags: true
      });

      cloudinaryProjects = result.resources.map(asset => {
        const context = (asset.context && asset.context.custom) || asset.context || {};
        return {
          _id: asset.public_id,
          title: context.title || 'Portfolio Project',
          description: context.description || '',
          roomType: context.roomType || 'Living Room',
          location: context.location || 'Hyderabad, India',
          images: [asset.secure_url],
          imageUrl: asset.secure_url,
          thumbnailUrl: asset.secure_url.replace('/upload/', '/upload/w_400,c_fill,g_auto/'),
          tags: asset.tags || [],
          featured: asset.tags ? asset.tags.includes('featured') : false,
          source: 'cloudinary'
        };
      });
    } catch (cErr) {
      console.warn('Cloudinary Fetch Warning:', cErr.message);
    }

    // Merge both sources
    const allProjects = [...localProjects, ...cloudinaryProjects];

    // If query param ?featured=true, filter them
    if (req.query.featured === 'true') {
      return res.json(allProjects.filter(p => p.featured));
    }

    res.json(allProjects);
  } catch (err) {
    console.error('Fetch Error:', err.message);
    res.status(500).json({ error: "Could not fetch projects" });
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

// POST - Admin only (Adds project or sets metadata)
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, roomType, images, featured } = req.body;
    // For now, since Cloudinary is the store, we'd ideally update an existing image's context.
    // Or we store this metadata in jsonDb if there's no specific asset.
    const newProject = jsonDb.add('projects', {
      title, description, roomType, images, featured: !!featured
    });
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: "Error creating project" });
  }
});

// PUT Update - Admin only
router.put("/:id", auth, async (req, res) => {
  try {
    const updated = jsonDb.update('projects', req.params.id, req.body);
    if (!updated) {
      // If not in JSON, try to update Cloudinary context directly if ID is a public_id
      const { title, description, roomType } = req.body;
      await cloudinary.api.update(req.params.id, {
        context: { title, description, roomType }
      });
      return res.json({ message: "Cloudinary metadata updated" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Error updating project" });
  }
});

// DELETE Project - Admin only
router.delete("/:id", auth, async (req, res) => {
  try {
    const success = jsonDb.delete('projects', req.params.id);
    if (!success) {
      // Try deleting from Cloudinary if it's not in JSON
      await cloudinary.uploader.destroy(req.params.id);
      return res.json({ message: "Deleted from Cloudinary" });
    }
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Error deleting project" });
  }
});

module.exports = router;
