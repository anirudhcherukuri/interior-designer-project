const axios = require('axios');

async function test() {
  const baseURL = 'https://interior-designer-project-9ae0.onrender.com/api';
  console.log('🔍 Checking Live API:', baseURL);
  
  try {
    const res = await axios.get(`${baseURL}/health`);
    console.log('✅ Health:', res.data);
    
    console.log('📝 Creating a Test Booking...');
    const booking = {
        clientName: 'Final E2E Verification',
        email: 'e2e@antigravity.ai',
        phone: '9999999999',
        serviceType: 'Luxury Interiors',
        message: 'Final System Validation Test',
        bookingDate: '2026-05-15',
        bookingTime: '11:00 AM'
    };
    
    const postRes = await axios.post(`${baseURL}/bookings`, booking);
    console.log('✅ Created!', postRes.data);
    
    // Now try to log in and FETCH all bookings to see if it's there
    console.log('🔐 Logging in for full data check...');
    const loginRes = await axios.post(`${baseURL}/auth/login`, {
        username: 'italianinteriors93@gmail.com',
        password: 'Designer@123'
    }, { withCredentials: true });
    
    console.log('✅ Logged in!');
    const cookie = loginRes.headers['set-cookie'];
    
    const listRes = await axios.get(`${baseURL}/bookings`, {
        headers: { Cookie: cookie ? cookie[0] : '' }
    });
    
    console.log('📅 All Bookings:', listRes.data.length);
    const found = listRes.data.find(b => b.clientName === 'Final E2E Verification');
    if (found) {
        console.log('🎯 Found our test booking! ID:', found._id);
    } else {
        console.log('❌ Test booking NOT found in list!');
    }
  } catch (e) {
    console.error('❌ Failed:', e.response?.data || e.message);
  }
}

test();
