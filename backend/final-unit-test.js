const axios = require('axios');

// Using the LIVE Render URL to test the actual deployed system
const BACKEND_URL = 'https://interior-designer-project-9ae0.onrender.com/api';

async function runFinalProductionTest() {
  console.log('🏁 Starting Final Production System Test (Cloudinary-Only Architecture)...\n');
  let testsFailed = 0;

  // 1. Test Global Connectivity
  try {
    process.stdout.write('Test 1: Live API Connectivity... ');
    const res = await axios.get(`${BACKEND_URL}/health`);
    if (res.data.server === 'Running') {
      console.log('✅ PASSED (Production Server is Online)');
    } else {
      throw new Error(`Server returned unexpected status: ${JSON.stringify(res.data)}`);
    }
  } catch (err) {
    console.log('❌ FAILED:', err.message);
    testsFailed++;
  }

  // 2. Test Cloudinary "No-DB" Gallery
  try {
    process.stdout.write('Test 2: Cloudinary Dynamic Assets Sync... ');
    const res = await axios.get(`${BACKEND_URL}/projects`);
    if (Array.isArray(res.data) && res.data.length > 0) {
      console.log(`✅ PASSED (${res.data.length} Real-time projects fetched from Cloudinary folder)`);
    } else if (Array.isArray(res.data)) {
      console.log('⚠️ SEMI-PASSED (API working, but Cloudinary folder is currently empty)');
    } else {
      throw new Error('Gallery did not return expected data format');
    }
  } catch (err) {
    console.log('❌ FAILED:', err.message);
    testsFailed++;
  }

  // 3. Test Database Integrity Verification
  try {
    process.stdout.write('Test 3: Database Storage Configuration... ');
    const res = await axios.get(`${BACKEND_URL}/health`);
    if (res.data.database === 'Persistent JSON DB') {
      console.log('✅ PASSED (Confirmed: Persistent JSON Data Layer Active)');
    } else {
      throw new Error(`Server reports unexpected DB status: ${res.data.database}`);
    }
  } catch (err) {
    console.log('❌ FAILED:', err.message);
    testsFailed++;
  }

  // 4. Test Form Submission (Console-Only Mode)
  try {
    process.stdout.write('Test 4: Contact Form Reliability... ');
    const res = await axios.post(`${BACKEND_URL}/enquiry`, {
      name: 'Production Test User',
      email: 'test@italian-interiors.com',
      message: 'Testing system after DB removal'
    });
    if (res.status === 200) {
      console.log('✅ PASSED (Form received & logged to server console)');
    } else {
      throw new Error('Form submission failed');
    }
  } catch (err) {
    console.log('❌ FAILED:', err.message);
    testsFailed++;
  }

  console.log('\n-----------------------------------');
  if (testsFailed === 0) {
    console.log('🚀 SYSTEM STATUS: 100% HEALTHY & PRODUCTION READY!');
    console.log('Architecture: Multi-Cloud (Render Compute + Cloudinary Storage)');
  } else {
    console.log(`⚠️ WARNING: ${testsFailed} tests failed. Please review the errors above.`);
  }
}

runFinalProductionTest();
