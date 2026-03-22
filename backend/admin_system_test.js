const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000/api';
let token = '';

async function runAudit() {
  console.log('🚀 INITIALIZING ADMIN SYSTEM AUDIT (PNG Fix)...');
  
  try {
    // 1. LOGIN TEST
    console.log('🔐 Step 1: Testing Admin Login...');
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    if (loginRes.data.success) {
      token = loginRes.data.token;
      console.log('✅ LOGIN SUCCESSFUL');
    } else {
      throw new Error('Login failed despite correct credentials');
    }

    // 2. UPLOAD TEST
    console.log('🖼️ Step 2: Testing Media Upload (1x1 Transparent PNG)...');
    const form = new FormData();
    // 1x1 transparent PNG pixel
    const pngBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
    form.append('file', pngBuffer, { filename: 'audit-pixel.png', contentType: 'image/png' });
    form.append('title', 'Audit Test Pixel');
    form.append('roomType', 'Testing');

    const uploadRes = await axios.post(`${BASE_URL}/upload`, form, {
      headers: { 
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}` 
      }
    });

    const fileId = uploadRes.data.fileId;
    console.log(`✅ UPLOAD SUCCESSFUL (ID: ${fileId})`);

    // 3. DELETE TEST
    console.log(`🗑️ Step 3: Testing Media Deletion (ID: ${fileId})...`);
    const deleteRes = await axios.delete(`${BASE_URL}/upload/${fileId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`✅ DELETION SUCCESSFUL: ${deleteRes.data.message}`);

    // 4. CONTACT TEST
    console.log('📬 Step 4: Testing Contact Form Submission...');
    const enquiryPayload = {
      name: 'Audit Bot',
      email: 'bot@audit.com',
      message: 'Self-Testing the Dashboard System'
    };
    const enquiryRes = await axios.post(`${BASE_URL}/enquiry`, enquiryPayload);
    const enquiryId = enquiryRes.data._id;
    console.log(`✅ ENQUIRY SENT (ID: ${enquiryId})`);

    // 5. VIEW ENQUIRY TEST
    console.log('📋 Step 5: Testing Admin Dashboard Enquiry Retrieval...');
    const listRes = await axios.get(`${BASE_URL}/enquiry`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    // Check if the exact enquiryId we just created is in the list
    const found = listRes.data.find(e => e._id === enquiryId);
    if (found) {
      console.log('✅ ENQUIRY FOUND IN ADMIN LIST');
    } else {
      throw new Error('Enquiry was sent but not found in Admin list');
    }

    console.log('\n🌟 AUDIT COMPLETE: ALL SYSTEMS NOMINAL 🌟');

  } catch (err) {
    console.error('❌ AUDIT FAILED:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

runAudit();
