const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { storage: cloudinaryStorage, cloudinary } = require('../services/cloudinaryService');
const auth = require('../middleware/authMiddleware');

// ─── Configuration Checks ───────────────────────────────────────────────────

const isCloudinaryConfigured = () => {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && 
            process.env.CLOUDINARY_API_KEY && 
            process.env.CLOUDINARY_API_SECRET);
};

// ─── Multer Storage Setup ────────────────────────────────────────────────────

// Local storage fallback (disk)
const localFsStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

// Select primary storage
let selectedStorage;
if (isCloudinaryConfigured()) {
  selectedStorage = cloudinaryStorage;
  console.log('✅ Cloudinary Storage initialized');
} else {
  selectedStorage = localFsStorage;
  console.log('⚠️ Local Disk Storage initialized (Cloudinary not configured)');
}

const upload = multer({
  storage: selectedStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed!'), false);
    }
  }
});

// ─── Routes ──────────────────────────────────────────────────────────────────

// Infrastructure check (used by E2E tests)
router.get('/test', (req, res) => {
  res.json({ ok: true, storage: isCloudinaryConfigured() ? 'Cloudinary' : 'Local' });
});

// ─── POST /api/upload (Single) ───────────────────────────────────────────────
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Please upload a file' });

    // Cloudinary (Handles upload automatically via storage)
    if (isCloudinaryConfigured()) {
      // If metadata is provided in body, update the asset after upload
      const { title, roomType, description } = req.body;
      const fileId = req.file.filename || req.file.public_id;

      if (title || roomType || description) {
        await cloudinary.api.update(fileId, {
          context: {
            title: title || 'Untitled Project',
            roomType: roomType || 'Gallery',
            description: description || 'Luxury interior design.'
          },
          tags: ['featured', (roomType || 'gallery').toLowerCase()]
        });
      }

      return res.json({
        fileId: fileId,
        fileUrl: req.file.path || req.file.secure_url,
        thumbnailUrl: (req.file.path || req.file.secure_url).replace('/upload/', '/upload/w_200,c_fill,g_auto/'),
        viewUrl: req.file.path || req.file.secure_url,
        name: req.file.originalname,
        storage: 'cloudinary',
      });
    }

    // Local Disk
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({
      fileId: req.file.filename,
      fileUrl: fileUrl,
      thumbnailUrl: fileUrl,
      viewUrl: fileUrl,
      name: req.file.originalname,
      storage: 'local-disk',
    });

  } catch (err) {
    console.error('Upload Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── POST /api/upload/multiple ───────────────────────────────────────────────
router.post('/multiple', auth, upload.array('files', 15), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No files uploaded' });

    // Cloudinary
    if (isCloudinaryConfigured()) {
      const files = req.files.map(file => ({
        fileId: file.filename || file.public_id,
        fileUrl: file.path || file.secure_url,
        thumbnailUrl: (file.path || file.secure_url).replace('/upload/', '/upload/w_200,c_fill,g_auto/'),
        viewUrl: file.path || file.secure_url,
        name: file.originalname,
      }));
      return res.json({ files, count: files.length, storage: 'cloudinary' });
    }

    // Local Disk
    const files = req.files.map(file => ({
      fileId: file.filename,
      fileUrl: `/uploads/${file.filename}`,
      name: file.originalname,
    }));
    res.json({ files, count: files.length, storage: 'local-disk' });

  } catch (err) {
    console.error('Multiple Upload Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── PATCH /api/upload/:fileId ──────────────────────────────────────────────
router.patch('/:fileId', auth, async (req, res) => {
  try {
    const { fileId } = req.params;
    const { title, roomType } = req.body;

    if (!isCloudinaryConfigured()) {
      return res.status(400).json({ error: 'Metadata updates only supported on Cloudinary' });
    }

    const updateData = {
      context: {
        title: title || 'Untitled Project',
        roomType: roomType || 'Gallery'
      }
    };

    // Update tags based on roomType
    if (roomType) {
      updateData.tags = ['featured', roomType.toLowerCase().replace(/\s+/g, '-')];
    }

    const result = await cloudinary.api.update(fileId, updateData);
    res.json({ message: 'Metadata updated successfully', result });

  } catch (err) {
    console.error('Update Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── DELETE /api/upload/:fileId ───────────────────────────────────────────────
router.delete('/:fileId', auth, async (req, res) => {
  try {
    const { fileId } = req.params;

    if (isCloudinaryConfigured()) {
      await cloudinary.uploader.destroy(fileId);
      return res.json({ message: 'Deleted from Cloudinary', fileId });
    }

    // Prevent Directory Traversal
    const sanitizedFileId = path.basename(fileId);
    const filePath = path.join(__dirname, '../uploads', sanitizedFileId);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ message: 'Deleted from local storage', fileId });

  } catch (err) {
    console.error('Delete Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── GET /api/upload (List All) ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    if (!isCloudinaryConfigured()) return res.json([]);

    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'interior-designer-portfolio', 
      max_results: 100,
      context: true
    });

    const files = result.resources.map(asset => {
      // Robust context extraction
      const context = asset.context ? (asset.context.custom || asset.context) : {};
      
      return {
        fileId: asset.public_id,
        name: asset.public_id.split('/').pop(),
        url: asset.secure_url,
        thumbnailUrl: asset.secure_url.replace('/upload/', '/upload/w_200,c_fill,g_auto/'),
        category: context.roomType || 'General',
        title: context.title || 'Portfolio Item'
      };
    });

    res.json(files);
  } catch (err) {
    console.error('List Error:', err.message);
    res.status(500).json({ error: 'Could not fetch media list' });
  }
});

// ─── GET /api/upload/test ─────────────────────────────────────────────────────
router.get('/test', async (req, res) => {
  const status = {
    cloudinary: isCloudinaryConfigured() ? 'Configured' : 'Missing Credentials',
    localStorage: 'Always Active (Fallback)',
  };
  res.json({ ok: true, status });
});

module.exports = router;
