require("dotenv").config();
const bcrypt = require("bcryptjs");
const hash = "$2b$10$KkukMyo17UPM5hTErkkCA.k9vfy/F5Y4naiyvgyioet/n7cE/NHlq";
const password = process.env.ADMIN_PASSWORD || "Password@123";

console.log(`🔍 Checking current password in .env: "${password}"`);

bcrypt.compare(password, hash).then(res => {
  if (res) {
    console.log("✅ MATCHED! Your login at italianinteriors93@gmail.com will work perfectly.");
  } else {
    console.log("❌ MISMATCH! Your current password in .env does NOT match the hash in db.json.");
    console.log("Suggestion: Use the 'reset-admin.js' script once more to sync them up.");
  }
});
