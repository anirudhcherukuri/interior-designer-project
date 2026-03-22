const bcrypt = require('bcryptjs'); bcrypt.hash('Designer@123', 10).then(hash => console.log('HASH_START' + hash + 'HASH_END'));
