const axios = require('axios');

async function waitForDeploys() {
  console.log('🔄 Waiting for Render Deploys to finish...');
  const backendUrl = 'https://interior-designer-backend-z72r.onrender.com/api/health';
  
  for (let i = 0; i < 20; i++) {
    try {
      const res = await axios.get(backendUrl);
      if (res.data.server === 'Running securely') {
        console.log('✨ SUCCESS: Production Backend is now updated to the latest version!');
        return;
      } else {
        console.log(`[Attempt ${i+1}] Still running older version: "${res.data.server}". Waiting 30s...`);
      }
    } catch (e) {
      console.log(`[Attempt ${i+1}] Server is likely restarting... (${e.message}). Waiting 30s...`);
    }
    await new Promise(r => setTimeout(r, 30000));
  }
  console.log('❌ Timeout after 10 minutes. Please check Render logs manually.');
}

waitForDeploys();
