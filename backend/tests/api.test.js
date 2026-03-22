process.env.NODE_ENV = 'test';

const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const jsonDb = require('../utils/jsonDb');

const DB_FILE = path.join(__dirname, '../data/db.json');

jest.setTimeout(30000);

let app;

describe('Database (JSON), API & Form Edge Cases Tests', () => {
  beforeAll(async () => {
    // Require routes
    const bookingRoutes = require('../routes/bookingRoutes');
    const enquiryRoutes = require('../routes/enquiryRoutes');
    const testimonialRoutes = require('../routes/testimonialRoutes');
    
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/bookings', bookingRoutes);
    app.use('/api/enquiry', enquiryRoutes);
    app.use('/api/testimonials', testimonialRoutes);
  });

  afterEach(() => {
    // No-op cleanup
  });

  // ─── DATABASE & CRUD TESTING ──────────────────────────────────────────────
  describe('Database (JSON DB) CRUD Verify', () => {
    it('✅ creates an Enquiry and persists correctly to JSON file', async () => {
      const res = await request(app)
        .post('/api/enquiry')
        .send({ name: 'Persist Test', email: 'persist@test.com', message: 'DB Check' });

      expect(res.statusCode).toBe(201);
      
      const fileData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      const foundInFile = fileData.enquiries.find(e => e.name === 'Persist Test');
      expect(foundInFile).toBeDefined();
      expect(foundInFile.status).toBe('new');
    });

    it('✅ update handles data in JSON file correctly', async () => {
      const enquiry = jsonDb.add('enquiries', { name: 'Update Me', status: 'new' });
      const id = enquiry._id;

      const updated = jsonDb.update('enquiries', id, { status: 'responded' });
      expect(updated.status).toBe('responded');

      const fileData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      const found = fileData.enquiries.find(e => e._id === id);
      expect(found.status).toBe('responded');
    });
  });

  // ─── FORM TESTING: Mass Assignment & Security ──────────────────────────────
  describe('Form Testing: Validation & Security', () => {
    it('🔒 prevents status assignment on creation (IDOR prevention)', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .send({
          clientName: 'Audit Test User',
          email: 'audit@test.com',
          status: 'confirmed'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('pending');
    });

    it('🔒 testimonial approved: false on creation (Mass assignment locked)', async () => {
      const res = await request(app)
        .post('/api/testimonials')
        .send({ clientName: 'Fake Customer', review: 'Amazing!', approved: true });

      expect(res.statusCode).toBe(201);
      expect(res.body.approved).toBe(false);
    });
  });

  // ─── EDGE CASES ────────────────────────────────────────────────────────────
  describe('Edge Cases', () => {
    it('⚠️ handles very long input strings without crashing DB write', async () => {
      const longString = 'B'.repeat(10000);
      const res = await request(app)
        .post('/api/enquiry')
        .send({ name: longString, message: 'Long Test' });

      expect(res.statusCode).toBe(201);
      const fileData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      const found = fileData.enquiries.find(e => e.name === longString);
      expect(found).toBeDefined();
    });

    it('✅ refresh behavior: verify same data exists after multiple reads', () => {
      const data1 = jsonDb.get('enquiries');
      const data2 = jsonDb.get('enquiries');
      expect(data1).toEqual(data2);
    });
  });
});
