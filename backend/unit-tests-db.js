const db = require('./utils/jsonDb');
const fs = require('fs');
const path = require('path');

async function runUnitTests() {
  console.log('🧪 RUNNING BACKEND UNIT TESTS: JSON DB ENGINE\n');
  let passed = 0;
  let total = 0;

  const assert = (condition, message) => {
    total++;
    if (condition) {
      passed++;
      console.log(`✅ ${message}`);
    } else {
      console.log(`❌ ${message}`);
    }
  };

  // Test 1: File Existence & Initialization
  const dbPath = path.join(__dirname, 'data', 'db.json');
  assert(fs.existsSync(dbPath), 'DB file initialization');

  // Test 2: Basic CRUD - Add
  const testEnquiry = { name: 'Unit Test', email: 'test@unit.com' };
  const added = db.add('enquiries', testEnquiry);
  assert(added._id && added.name === 'Unit Test', 'JSON DB: Add Item');

  // Test 3: Basic CRUD - Get
  const allEnquiries = db.get('enquiries');
  const found = allEnquiries.find(e => e._id === added._id);
  assert(found && found.name === 'Unit Test', 'JSON DB: Get Item');

  // Test 4: Basic CRUD - Update
  const updated = db.update('enquiries', added._id, { name: 'Updated Name' });
  assert(updated && updated.name === 'Updated Name', 'JSON DB: Update Item');

  // Test 5: Visitor Counter logic
  const initialCount = db.get('visitors').count;
  db.incrementVisitor();
  const nextCount = db.get('visitors').count;
  assert(nextCount === initialCount + 1, 'JSON DB: Increment Visitor');

  // Test 6: Delete
  const deleted = db.delete('enquiries', added._id);
  const postDelete = db.get('enquiries').find(e => e._id === added._id);
  assert(deleted && !postDelete, 'JSON DB: Delete Item');

  console.log('\n---------------------------------------');
  console.log(`📊 UNIT TEST SUMMARY: ${passed}/${total} PASSED`);
  
  if (passed === total) {
    console.log('🏆 ALL UNIT TESTS PASSED!');
    process.exit(0);
  } else {
    console.log('⚠️ SOME UNIT TESTS FAILED.');
    process.exit(1);
  }
}

runUnitTests().catch(err => {
  console.error('CRITICAL TEST ERROR:', err);
  process.exit(1);
});
