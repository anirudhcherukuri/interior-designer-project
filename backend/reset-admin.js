const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_FILE = path.join(__dirname, 'data/db.json');
const DATA_DIR = path.join(__dirname, 'data');

async function resetAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  
  console.log(`🔐 RESETTING ADMIN CREDENTIALS...`);
  console.log(`👤 Target Username: ${username}`);
  
  // Ensure Directory Exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('✅ Created data directory.');
  }
  
  // Base Structure
  let db = {
    users: [], enquiries: [], bookings: [],
    projects: [], testimonials: [], visitors: { count: 0 }
  };
  
  // Load existing if possible
  if (fs.existsSync(DB_FILE)) {
    try {
        db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
        console.log('⚠️ db.json corrupted, starting fresh.');
    }
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Clear any existing user with this username
  db.users = (db.users || []).filter(u => u.username !== username);
  
  // Force Add
  db.users.push({
    _id: "RESET-" + Date.now(),
    username,
    password: hashedPassword,
    role: 'admin',
    createdAt: new Date().toISOString()
  });
  
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  console.log(`✅ SYNC COMPLETE!`);
  console.log(`✅ File saved at: ${DB_FILE}`);
}

resetAdmin().catch(console.error);
