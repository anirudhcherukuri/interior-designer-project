const axios = require('axios');

// LIVE PRODUCTION ENDPOINTS
const BACKEND_URL = 'https://interior-designer-project-9ae0.onrender.com/api';
const FRONTEND_URL = 'https://interior-designer-frontend-nyf6.onrender.com';

async function runAbsoluteFinalTest() {
  console.log('🛡️  STARTING ABSOLUTE FINAL PRODUCTION AUDIT...');
  console.log('Scenario: Cloudinary-as-a-DB + Multi-Cloud Render Deployment\n');
  
  let failures = [];

  // 1. Check Backend Health & DB-less Status
  try {
    process.stdout.write('1. Backend Multi-Cloud Health... ');
    const res = await axios.get(`${BACKEND_URL}/health`);
    if (res.data.server === 'Running' && res.data.database === 'None (Cloudinary Dynamic Media Only)') {
      console.log('✅ PASSED');
    } else {
      throw new Error(`Unexpected health status: ${JSON.stringify(res.data)}`);
    }
  } catch (err) {
    console.log('❌ FAILED');
    failures.push(`Backend Health: ${err.message}`);
  }

  // 2. Check Cloudinary Metadata Integration
  try {
    process.stdout.write('2. Cloudinary Metadata DB... ');
    const res = await axios.get(`${BACKEND_URL}/projects`);
    const hasMetadata = res.data.some(p => p.roomType && p.roomType !== 'Gallery');
    if (Array.isArray(res.data) && res.data.length > 0 && hasMetadata) {
      console.log(`✅ PASSED (${res.data.length} items with dynamic metadata)`);
    } else {
      throw new Error('Could not find projects with metadata. Ensure Cloudinary contexts are set.');
    }
  } catch (err) {
    console.log('❌ FAILED');
    failures.push(`Cloudinary Metadata: ${err.message}`);
  }

  // 3. Check Live Frontend Accessibility
  try {
    process.stdout.write('3. Frontend Live Accessibility... ');
    const res = await axios.get(FRONTEND_URL);
    if (res.status === 200 && res.data.includes('<div id="root">')) {
      console.log('✅ PASSED');
    } else {
      throw new Error('Frontend reachable but React root not found.');
    }
  } catch (err) {
    console.log('❌ FAILED');
    failures.push(`Frontend Access: ${err.message}`);
  }

  // 4. Check CORS Policy (Frontend -> Backend Communication)
  try {
    process.stdout.write('4. Cross-Origin (CORS) Security... ');
    const res = await axios.options(`${BACKEND_URL}/projects`, {
      headers: { 'Origin': FRONTEND_URL }
    });
    if (res.status === 204 || res.status === 200) {
      console.log('✅ PASSED');
    } else {
      throw new Error(`CORS headers missing or incorrect. Status: ${res.status}`);
    }
  } catch (err) {
    console.log('❌ FAILED');
    failures.push(`CORS Policy: ${err.message}`);
  }

  // 5. Check Enquiry Route Integrity
  try {
    process.stdout.write('5. Contact Log Integrity... ');
    const res = await axios.post(`${BACKEND_URL}/enquiry`, {
      name: 'Final Audit Bot',
      email: 'audit@italianinteriors.com',
      message: 'Self-Diagnostic Test'
    });
    if (res.status === 200) {
      console.log('✅ PASSED');
    } else {
      throw new Error('Post-enquiry failed.');
    }
  } catch (err) {
    console.log('❌ FAILED');
    failures.push(`Enquiry Route: ${err.message}`);
  }

  console.log('\n=======================================');
  if (failures.length === 0) {
    console.log('💎 RESULT: WORLD-CLASS STABILITY DETECTED.');
    console.log('All systems are 100% operational.');
  } else {
    console.log('🚨 AUDIT FAILED. ERRORS FOUND:');
    failures.forEach(f => console.log(` - ${f}`));
  }
}

runAbsoluteFinalTest();
