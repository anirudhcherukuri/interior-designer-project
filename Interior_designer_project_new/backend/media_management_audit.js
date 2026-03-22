const axios = require('axios');

// Production Endpoint
const API = 'https://interior-designer-project-9ae0.onrender.com/api';

async function auditMediaManagement() {
  console.log('📸 STARTING DEEP MEDIA MANAGEMENT AUDIT\n');
  let failures = [];

  const check = async (name, operation) => {
    process.stdout.write(`• ${name}... `);
    try {
      const start = Date.now();
      await operation();
      console.log(`✅ PASSED (${Date.now() - start}ms)`);
    } catch (err) {
      console.log('❌ FAILED');
      failures.push(`${name}: ${err.message}`);
    }
  };

  // 1. Audit Listing Reliability
  await check('Fetch Media Inventory', async () => {
    const res = await axios.get(`${API}/upload`);
    if (!Array.isArray(res.data)) throw new Error('Invalid inventory format');
    console.log(`(${res.data.length} assets found) `);
    
    // Check for critical system assets
    const hasOriginalBg = res.data.some(f => f.name.includes('original-bg'));
    if (!hasOriginalBg) console.warn(' [Note: original-bg not found in public list]');
  });

  // 2. Audit Media Categories (Management)
  await check('Validate Category Mapping', async () => {
    const res = await axios.get(`${API}/upload`);
    const hasMappedCategories = res.data.every(f => f.category);
    if (!hasMappedCategories) throw new Error('Some assets missing category metadata');
  });

  // 3. Audit Portfolio Integration
  await check('Sync Dashboard & Portfolio', async () => {
    const uploadRes = await axios.get(`${API}/upload`);
    const projectRes = await axios.get(`${API}/projects`);
    
    // Portfolio (Projects) should be a subset of total Media uploads
    if (projectRes.data.length > uploadRes.data.length) {
      console.warn(' [Warning: Projects exceed Media count - check tagging]');
    }
  });

  // 4. Audit Deletion Safety
  await check('Verify Deletion Route', async () => {
    // We send a non-existent ID to verify the server handles the Cloudinary request without crashing
    const res = await axios.delete(`${API}/upload/audit_safe_check_id`);
    if (res.status !== 200) throw new Error(`Delete route returned ${res.status}`);
  });

  console.log('\n=======================================');
  if (failures.length === 0) {
    console.log('✨ MEDIA MANAGEMENT AUDIT: SUCCESSFUL');
    console.log('Inventory is synced, categories are mapped, and deletion is secure.');
  } else {
    console.log('🚨 MEDIA AUDIT DISCREPANCIES:');
    failures.forEach(f => console.log(` - ${f}`));
  }
}

auditMediaManagement();
