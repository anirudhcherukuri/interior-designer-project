const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');

const configPath = path.join(__dirname, '../../frontend/src/config/projects.config.json');
const galleryDir = path.join(__dirname, '../../frontend/public/gallery');

// Helper to read JSON
const readData = () => {
    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) { return []; }
};

// Helper to write JSON
const writeData = (data) => {
    fs.writeFileSync(configPath, JSON.stringify(data, null, 4));
};

// GET all houses
router.get('/', (req, res) => {
    res.json(readData());
});

// GET gallery filenames
router.get('/gallery', auth, (req, res) => {
    try {
        const files = fs.readdirSync(galleryDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
        res.json(files.reverse());
    } catch (e) { res.json([]); }
});

// CREATE house
router.post('/', auth, (req, res) => {
    const houses = readData();
    const newHouse = {
        id: `house-${Date.now()}`,
        ...req.body
    };
    houses.unshift(newHouse);
    writeData(houses);
    res.status(201).json(newHouse);
});

// UPDATE house
router.put('/:id', auth, (req, res) => {
    const houses = readData();
    const idx = houses.findIndex(h => h.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'House not found' });
    
    houses[idx] = { ...houses[idx], ...req.body, id: req.params.id };
    writeData(houses);
    res.json(houses[idx]);
});

// DELETE house
router.delete('/:id', auth, (req, res) => {
    let houses = readData();
    houses = houses.filter(h => h.id !== req.params.id);
    writeData(houses);
    res.json({ message: 'Deleted' });
});

module.exports = router;
