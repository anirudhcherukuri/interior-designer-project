const axios = require('axios');

async function test() {
  const baseURL = 'https://interior-designer-backend-wsmf.onrender.com';
  console.log('🔍 Checking Live API:', baseURL);
  
  try {
    const res = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Health:', res.data);
    
    // Check if we can see any bookings publicly (Wait, they are protected!)
    // I don't have a token here. 
    // But I can try to CREATE one and then see if it persists (log it).
    
    console.log('📝 Attempting to Create a Test Booking...');
    const booking = {
        clientName: 'Antigravity Verification User',
        email: 'verify@antigravity.ai',
        phone: '1234567890',
        serviceType: 'Residential Design',
        message: 'Direct API Verification Test',
        bookingDate: '2026-04-01',
        bookingTime: '10:00 AM'
    };
    
    const postRes = await axios.post(`${baseURL}/api/bookings`, booking);
    console.log('✅ Created!', postRes.data);
    
    console.log('Wait a few seconds...');
    await new Promise(r => setTimeout(r, 3000));
    
    console.log('Querying again (Wait, still need auth for GET)');
  } catch (e) {
    console.error('❌ Failed:', e.response?.data || e.message);
  }
}

test();
