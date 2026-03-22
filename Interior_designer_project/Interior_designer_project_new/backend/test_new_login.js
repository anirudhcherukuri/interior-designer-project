const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });

async function testAdminLogin() {
    console.log('🔐 Testing Admin Login with new credentials...');
    const url = 'http://localhost:5000/api/auth/login';
    const credentials = {
        username: 'italianinteriors93@gmail.com',
        password: 'Password@123'
    };

    try {
        const response = await axios.post(url, credentials);
        if (response.status === 200 && response.data.success) {
            console.log('✅ SUCCESS: Login works with new credentials.');
            console.log('User Role:', response.data.user.role);
        } else {
            console.log('❌ FAILED: Unexpected response status or body.');
        }
    } catch (error) {
        console.error('❌ FAILED: Login error:', error.response ? error.response.data : error.message);
    }
}

testAdminLogin();
