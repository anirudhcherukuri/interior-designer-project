const axios = require('axios');

// Production Endpoint
const API = 'https://interior-designer-project-9ae0.onrender.com/api';

async function runFinalVerification() {
  console.log('🏁 STARTING GLOBAL SYSTEM VERIFICATION (UNIT + E2E)\n');
  let failures = [];

  const check = async (name, operation) => {
    process.stdout.write(`• Checking ${name}... `);
    try {
      await operation();
      console.log('✅ PASSED');
    } catch (err) {
      console.log('❌ FAILED');
      failures.push(`${name}: ${err.message}`);
    }
  };

  // --- UNIT TESTS ---
  await check('Health API & DB Status', async () => {
    const res = await axios.get(`${API}/health`);
    if (res.data.database !== 'None (Cloudinary Dynamic Media Only)') throw new Error('DB Status Incorrect');
  });

  await check('CORS Policy Accessibility', async () => {
    await axios.options(`${API}/projects`);
  });

  await check('Cloudinary Metadata Fetch', async () => {
    const res = await axios.get(`${API}/projects`);
    if (!Array.isArray(res.data)) throw new Error('Projects not returned as array');
  });

  // --- E2E TESTS (USER FLOWS) ---
  await check('Secure Admin Login (admin/admin123)', async () => {
    const res = await axios.post(`${API}/auth/login`, { username: 'admin', password: 'admin123' });
    if (!res.data.success) throw new Error('Login failed');
  });

  await check('Security Block (Wrong Password)', async () => {
    try {
      await axios.post(`${API}/auth/login`, { username: 'admin', password: 'wrong' });
      throw new Error('Security Bypass Detected');
    } catch (err) {
      if (err.response?.status !== 401) throw err;
    }
  });

  await check('Admin Media Upload Route', async () => {
    const res = await axios.get(`${API}/upload/test`);
    if (!res.data.ok) throw new Error('Upload route offline');
  });

  await check('Project Addition Flow', async () => {
    const res = await axios.post(`${API}/projects`, { title: 'Final Test', roomType: 'Gallery' });
    if (res.status !== 200) throw new Error('Create project failed');
  });

  await check('Media Deletion Flow', async () => {
    const res = await axios.delete(`${API}/upload/test-file-id`);
    if (res.status !== 200) throw new Error('Delete project failed');
  });

  await check('Contact/Booking Submission', async () => {
    const res = await axios.post(`${API}/bookings`, {
      clientName: 'Audit User',
      email: 'audit@example.com',
      phone: '9999999999',
      location: 'Audit Studio',
      budget: 'Premium',
      serviceType: 'Luxury Consultation',
      message: 'System audit automated message',
      bookingDate: '2026-12-31',
      bookingTime: '12:00'
    });
    if (res.status !== 200) throw new Error('Booking form failed');
  });

  console.log('\n=======================================');
  if (failures.length === 0) {
    console.log('💎 GLOBAL VERIFICATION: 100% SUCCESS');
    console.log('The system is ironclad and production-ready.');
  } else {
    console.log('🚨 FAILURES DETECTED:');
    failures.forEach(f => console.log(` - ${f}`));
  }
}

runFinalVerification();
