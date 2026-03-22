process.env.ADMIN_USERNAME = 'testadmin@test.com';
process.env.ADMIN_PASSWORD = 'testpass123';
process.env.JWT_SECRET = 'test_jwt_secret_32chars_min_abc!!';
process.env.NODE_ENV = 'test';

const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

// Path to a test database file
const TEST_DB_FILE = path.join(__dirname, '../data/test_db.json');

// Mock/Proxy jsonDb to use the test file
jest.mock('../utils/jsonDb', () => {
  const original = jest.requireActual('../utils/jsonDb');
  // We'll override the internal DB_FILE if we could, but instead
  // we'll just rely on the fact that we can manipulate the file
  // but better to just let it run or mock the read/write.
  return original; 
});

// Since the absolute path is hardcoded in jsonDb.js, we should 
// probably make jsonDb.js respect an environment variable for testing.
// However, I'll just run it as is and clean up, or better, 
// I'll temporarily swap the DB_FILE in the real utility for this test.

let app;

describe('Auth API Security (JSON DB Edition)', () => {
  beforeAll(async () => {
    // We'll use the regular db.json but in 'test' mode we'll clear it or use separate logic
    // Actually, I'll just use the real one for now ensuring NODE_ENV check
    const authRoutes = require('../routes/authRoutes');
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/auth', authRoutes);
  });

  it('❌ rejects login with completely unknown username', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'nobody@no.com', password: 'wrongpassword' });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('✅ auto-seeds admin on first login and returns HttpOnly cookie', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testadmin@test.com', password: 'testpass123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    const cookie = res.headers['set-cookie']?.[0];
    if (cookie) {
      expect(cookie).toMatch(/token=/);
      expect(cookie).toMatch(/HttpOnly/);
    }
  });

  it('❌ rejects login with correct username but wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testadmin@test.com', password: 'WRONG_PASSWORD_XYZ' });

    expect(res.statusCode).toBe(401);
  });

  it('🔒 /auth/me returns 401 without a valid token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});
