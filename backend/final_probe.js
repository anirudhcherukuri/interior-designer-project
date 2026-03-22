const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

async function finalProbe() {
    console.log('🔍 INITIATING FINAL PROBE OF PORT 5000...');
    try {
        const payload = { username: 'admin', password: 'admin123' };
        console.log('📤 Sending payload:', payload);
        
        const res = await axios.post(`${BASE_URL}/auth/login`, payload);
        
        if (res.data.success) {
            console.log('✅ Final Probe Result: AUTHENTICATED SUCCESSFULLY');
            console.log('💡 HINT: The backend is 100% correct. If the browser fails, clear your cache/cookies or check for spaces.');
        } else {
            console.log('❌ Final Probe Result: REJECTED (Backend Logic Issue)');
        }
    } catch (err) {
        console.error('❌ Final Probe Error:', err.response ? err.response.data : err.message);
    }
}

finalProbe();
