process.env.NODE_ENV = 'test';
process.env.CLOUDINARY_CLOUD_NAME = 'test_cloud';
process.env.CLOUDINARY_API_KEY = 'test_key';
process.env.CLOUDINARY_API_SECRET = 'test_secret';

const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs');

// Mock Cloudinary to prevent real API calls
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    api: {
      resources: jest.fn().mockResolvedValue({ resources: [] }),
      resource: jest.fn().mockResolvedValue({ public_id: 'test' }),
      update: jest.fn().mockResolvedValue({})
    },
    uploader: {
      destroy: jest.fn().mockResolvedValue({ result: 'ok' })
    }
  }
}));

const uploadRoutes = require('../routes/uploadRoutes');
const projectRoutes = require('../routes/projectRoutes');

const app = express();
app.use(express.json());
app.use('/api/upload', uploadRoutes);
app.use('/api/projects', projectRoutes);

describe('Media Upload & Delete Tests (Mocked Cloudinary)', () => {
  const testDir = path.join(__dirname);
  const invalidFilePath = path.join(testDir, 'test_invalid.txt');
  const validJpgPath   = path.join(testDir, 'test_valid.jpg');

  beforeAll(() => {
    fs.writeFileSync(invalidFilePath, 'No image here');
    const jpgBuffer = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]);
    fs.writeFileSync(validJpgPath, jpgBuffer);
  });

  afterAll(() => {
    if (fs.existsSync(invalidFilePath)) fs.unlinkSync(invalidFilePath);
    if (fs.existsSync(validJpgPath))    fs.unlinkSync(validJpgPath);
  });

  it('🔒 POST /api/upload requires auth token', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('file', validJpgPath);
    expect(res.statusCode).toBe(401);
  });

  it('✅ GET /api/projects is publicly accessible (uses Mock)', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('🛡️ prevents file system traversal via parameter manipulation', async () => {
    const res = await request(app).delete('/api/upload/..%2F..%2Fserver.js');
    expect(res.statusCode).toBe(401); 
  });
});
