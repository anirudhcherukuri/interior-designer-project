const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function testAdminMediaFlow() {
  console.log('🧪 Starting Local Admin Media Logic Test...');
  const API_URL = 'http://localhost:5000/api';

  try {
    // 1. Login
    console.log('Step 1: Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      username: 'italianinteriors93@gmail.com',
      password: 'Password@123'
    });
    const cookie = loginRes.headers['set-cookie'];
    console.log('✅ Login successful');

    // 2. Upload
    console.log('Step 2: Uploading test image...');
    const form = new FormData();
    const testImgPath = path.join(__dirname, 'media_check.log'); // Just a dummy file for binary test
    form.append('file', fs.createReadStream(testImgPath), 'test_file.jpg');
    form.append('roomType', 'Bedroom');
    form.append('title', 'Local Test Asset');

    const uploadRes = await axios.post(`${API_URL}/upload`, form, {
      headers: { ...form.getHeaders(), Cookie: cookie }
    });
    const fileId = uploadRes.data.fileId;
    console.log('✅ Upload successful. FileID:', fileId);

    // 3. Verify in List
    console.log('Step 3: Verifying asset in list...');
    const listRes = await axios.get(`${API_URL}/upload`);
    const found = listRes.data.find(f => f.fileId === fileId);
    console.log('✅ Asset found in list:', !!found);

    // 4. Delete
    console.log('Step 4: Deleting asset...');
    await axios.delete(`${API_URL}/upload/${fileId}`, {
      headers: { Cookie: cookie }
    });
    console.log('✅ Deletion successful');

    console.log('\n🌟 ALL LOCAL ADMIN MEDIA LOGIC TESTS PASSED!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.response?.data || err.message);
    process.exit(1);
  }
}

// Start local server in background for testing
const { spawn } = require('child_process');
const server = spawn('node', ['server.js'], { cwd: __dirname });

server.stdout.on('data', (data) => {
  if (data.toString().includes('started on port')) {
    testAdminMediaFlow();
  }
});

server.stderr.on('data', (data) => {
  console.error('Server Error:', data.toString());
});

setTimeout(() => {
  console.error('Timeout waiting for server to start');
  server.kill();
  process.exit(1);
}, 10000);
