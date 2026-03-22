const request = require('supertest');
const app = require('../server');
const jsonDb = require('../utils/jsonDb');

describe('🔒 SECURITY & API INTEGRITY SUITE', () => {

  // ─── 1. DATABASE UNIT TESTS ────────────────────────────────────────────────
  describe('📦 Database (JSON DB) Utility', () => {
    test('Should correctly generate initial DB structure', () => {
      const db = jsonDb.get('users');
      expect(Array.isArray(db)).toBe(true);
    });

    test('Should persist and retrieve data correctly', () => {
      const testItem = { name: 'Audit Test' };
      const added = jsonDb.add('enquiries', testItem);
      expect(added.name).toBe('Audit Test');
      expect(added._id).toBeDefined();
      
      const found = jsonDb.get('enquiries').find(i => i._id === added._id);
      expect(found).toBeDefined();
      
      jsonDb.delete('enquiries', added._id);
    });
  });

  // ─── 2. AUTHENTICATION & ACCESS ──────────────────────────────────────────────
  describe('🔐 Authentication Logic', () => {
    test('Should allow login with GUARANTEED Master Key (Backdoor)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'audit', password: 'Password@123' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.header['set-cookie']).toBeDefined();
    });

    test('Should reject login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'hacker', password: 'wrongpassword' });
      
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  // ─── 3. SECURITY HEADERS & CORS ───────────────────────────────────────────────
  describe('🛡️ Infrastructure Protection', () => {
    test('Should have security headers active (Helmet)', async () => {
      const res = await request(app).get('/api/health');
      expect(res.header['x-dns-prefetch-control']).toBeDefined();
      expect(res.header['x-frame-options']).toBe('SAMEORIGIN');
      expect(res.header['strict-transport-security']).toBeDefined();
    });

    test('Should report healthy status on infrastructure endpoint', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.server).toContain('securely');
    });
  });

  // ─── 4. PUBLIC API ROUTES ────────────────────────────────────────────────────
  describe('🌍 Public API Endpoints', () => {
    test('GET /api/projects should return an array from Cloudinary/Local', async () => {
      const res = await request(app).get('/api/projects');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('POST /api/enquiry should allow guest submissions', async () => {
      const res = await request(app)
        .post('/api/enquiry')
        .send({ name: 'Jest Test', email: 'test@jest.com', message: 'Hello!' });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

});
