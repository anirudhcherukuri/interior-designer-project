const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const testUpload = async () => {
    console.log('🚀 Testing Media Upload (Cloudinary)...');
    
    // Check if we have an image to upload
    const testImagePath = path.join(__dirname, '../frontend/public/gallery/bedroom1.jpeg');
    if (!fs.existsSync(testImagePath)) {
        console.error('❌ Test image not found at:', testImagePath);
        return;
    }

    const form = new FormData();
    form.append('file', fs.createReadStream(testImagePath));

    try {
        const response = await axios.post('http://localhost:5000/api/upload', form, {
            headers: {
                ...form.getHeaders()
            },
            timeout: 30000 // 30 seconds
        });

        console.log('✅ Upload Successful!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (err) {
        console.error('❌ Upload Failed:', err.response ? err.response.data : err.message);
    }
};

testUpload();
