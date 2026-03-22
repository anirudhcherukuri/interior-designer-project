const axios = require('axios');
const API = 'https://interior-designer-project-9ae0.onrender.com/api';

async function testLogin() {
  try {
    const res = await axios.post(`${API}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    console.log('API RESPONSE:', res.status, res.data);
  } catch (err) {
    console.error('API ERROR:', err.response ? err.response.status : err.message, err.response ? err.response.data : '');
  }
}

testLogin();
