const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files from the build folder
app.use(express.static(path.join(__dirname, 'build')));

// Handle SPA routing - send index.html for any request that isn't a static file
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Frontend server running on port ${PORT}`);
});
