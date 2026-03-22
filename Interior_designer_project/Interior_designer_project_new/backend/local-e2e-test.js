const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });

const API = 'http://localhost:5000/api';

async function runLocalE2ETest() {
  console.log('🏗️  STARTING LOCAL END-TO-END SYSTEM TEST...');
  console.log('Target: Local Persistent JSON DB + Cloudinary + Secure Auth\n');
  
  let failures = [];
  let token = null;

  // 1. TEST: SECURE ADMIN LOGIN (Using New Credentials)
  try {
    process.stdout.write('1. Secure Admin Authentication... ');
    const res = await axios.post(`${API}/auth/login`, {
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD
    });
    if (res.data.success && res.data.token) {
      token = res.data.token;
      console.log('✅ PASSED (Access Granted)');
    } else {
      throw new Error('Login response invalid');
    }
  } catch (err) {
    console.log('❌ FAILED');
    failures.push(`Auth: ${err.message}`);
  }

  // 2. TEST: VISITOR TRACKING PERSISTENCE
  try {
    process.stdout.write('2. Visitor Tracking Persistence... ');
    const resBefore = await axios.get(`${API}/visitor/stats`);
    const countBefore = resBefore.data[0].count;
    
    await axios.post(`${API}/visitor`);
    
    const resAfter = await axios.get(`${API}/visitor/stats`);
    const countAfter = resAfter.data[0].count;
    
    if (countAfter === countBefore + 1) {
      console.log('✅ PASSED (Incremented from ' + countBefore + ' to ' + countAfter + ')');
    } else {
      throw new Error('Visitor count did not increment correctly');
    }
  } catch (err) {
    console.log('❌ FAILED');
    failures.push(`Visitor: ${err.message}`);
  }

  // 3. TEST: BOOKING DATA INTEGRITY
  try {
    process.stdout.write('3. Booking Storage Logic... ');
    const testBooking = { clientName: 'E2E Test Client', serviceType: 'Living Room' };
    const addRes = await axios.post(`${API}/bookings`, testBooking);
    const bookingId = addRes.data._id;
    
    const getRes = await axios.get(`${API}/bookings`);
    const found = getRes.data.find(b => b._id === bookingId);
    
    if (found && found.clientName === 'E2E Test Client') {
      console.log('✅ PASSED (Stored and retrieved successfully)');
      // Cleanup
      await axios.delete(`${API}/bookings/${bookingId}`);
    } else {
      throw new Error('Booking could not be retrieved after storage');
    }
  } catch (err) {
    console.log('❌ FAILED');
    failures.push(`Booking: ${err.message}`);
  }

  // 4. TEST: CONTACT FORM (ENQUIRY) STORAGE
  try {
    process.stdout.write('4. Contact Form Database Write... ');
    const testEnquiry = { name: 'E2E Enquiry', message: 'Test message' };
    const res = await axios.post(`${API}/enquiry`, testEnquiry);
    
    const listRes = await axios.get(`${API}/enquiry`);
    const found = listRes.data.find(e => e._id === res.data._id);
    
    if (found) {
      console.log('✅ PASSED (Saved to Persistent Storage)');
    } else {
      throw new Error('Enquiry was not found in database after post');
    }
  } catch (err) {
    console.log('❌ FAILED');
    failures.push(`Enquiry: ${err.message}`);
  }

  console.log('\n=======================================');
  if (failures.length === 0) {
    console.log('🌟 LOCAL E2E RESULT: SYSTEM IS COMPLETELY STABLE.');
    console.log('Verified: Auth, Persistence, and API logic across all modules.');
  } else {
    console.log('🚨 LOCAL E2E AUDIT FAILED:');
    failures.forEach(f => console.log(` - ${f}`));
  }
}

runLocalE2ETest();
