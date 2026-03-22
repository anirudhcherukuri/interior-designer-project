const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '../data/db.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const getDefaultDb = () => ({
    users: [],
    enquiries: [],
    bookings: [],
    testimonials: [],
    visitors: { count: 125, sources: [], devices: [] }
});

// Initial structure if file doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(getDefaultDb(), null, 2));
}

const readDb = () => {
    try {
        if (!fs.existsSync(DB_FILE)) return getDefaultDb();
        const data = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(data);
        // Merge with defaults to ensure all keys exist
        return { ...getDefaultDb(), ...parsed };
    } catch (err) {
        return getDefaultDb();
    }
};

const writeDb = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

module.exports = {
    get: (key) => readDb()[key],
    
    add: (key, item) => {
        const db = readDb();
        if (!db[key]) db[key] = [];
        const newItem = { ...item, _id: Date.now().toString(), createdAt: new Date().toISOString() };
        db[key].unshift(newItem);
        writeDb(db);
        return newItem;
    },

    update: (key, id, updates) => {
        const db = readDb();
        if (!db[key]) return null;
        const index = db[key].findIndex(i => i._id === id);
        if (index !== -1) {
            db[key][index] = { ...db[key][index], ...updates };
            writeDb(db);
            return db[key][index];
        }
        return null;
    },

    delete: (key, id) => {
        const db = readDb();
        if (!db[key]) return false;
        db[key] = db[key].filter(i => i._id !== id);
        writeDb(db);
        return true;
    },

    incrementVisitor: () => {
        const db = readDb();
        if (!db.visitors) db.visitors = { count: 0, sources: [], devices: [] };
        db.visitors.count = (db.visitors.count || 0) + 1;
        writeDb(db);
        return db.visitors.count;
    },

    // ─── AUTHENTICATION HELPERS ───────────────────────────────────────────────────

    findUser: (username) => {
        const db = readDb();
        return (db.users || []).find(u => u.username === username);
    },

    seedUser: async (username, password) => {
        const db = readDb();
        const users = db.users || [];
        if (users.some(u => u.username === username)) return;
        
        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({
            username,
            password: hashedPassword,
            role: 'admin',
            _id: Date.now().toString(),
            createdAt: new Date().toISOString()
        });
        db.users = users;
        writeDb(db);
        console.log(`🔐 Admin user seeded: ${username}`);
    },

    comparePassword: async (entered, hashed) => {
        return await bcrypt.compare(entered, hashed);
    }
};
