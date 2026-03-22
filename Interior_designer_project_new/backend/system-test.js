const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/api';

const runFullTest = async () => {
    console.log('🏁 Starting Comprehensive System Test...');

    // 1. Check Health
    try {
        const health = await axios.get(`${API_URL}/health`);
        console.log('📡 Server Status:', health.data.server);
        console.log('🗄️ Database Status:', health.data.database);
    } catch (err) {
        console.error('❌ Health check failed');
    }

    // 2. Upload Media to Cloudinary
    let fileUrl = '';
    try {
        const testImagePath = path.join(__dirname, '../frontend/public/gallery/bedroom1.jpeg');
        const form = new FormData();
        form.append('file', fs.createReadStream(testImagePath));

        console.log('📤 Uploading to Cloudinary...');
        const uploadRes = await axios.post(`${API_URL}/upload`, form, {
            headers: form.getHeaders()
        });
        fileUrl = uploadRes.data.fileUrl;
        console.log('✅ Cloudinary Upload OK:', fileUrl);
    } catch (err) {
        console.error('❌ Cloudinary Upload Failed:', err.message);
    }

    // 3. Create Project in DB (Test DB responsiveness)
    if (fileUrl) {
        try {
            console.log('📝 Creating Project in Database...');
            const projectRes = await axios.post(`${API_URL}/projects`, {
                title: 'Test Luxury Suite',
                description: 'A test project created during system verification.',
                roomType: 'Bedroom',
                location: 'System Test',
                images: [fileUrl],
                featured: true
            });
            console.log('✅ Database Project Creation OK ID:', projectRes.data._id);
        } catch (err) {
            console.error('❌ Database Project Creation Failed:', err.response ? err.response.data : err.message);
        }
    }

    // 4. Test Multiple Users (Simple Booking Submission)
    try {
        console.log('👥 Simulating User Booking...');
        const bookingRes = await axios.post(`${API_URL}/bookings`, {
            clientName: 'Test User 1',
            email: 'test@example.com',
            phone: '1234567890',
            serviceType: 'Consultation',
            message: 'Testing multi-user interaction.'
        });
        console.log('✅ User Booking OK ID:', bookingRes.data._id);
    } catch (err) {
        console.error('❌ User Booking Failed:', err.response ? err.response.data : err.message);
    }

    console.log('\n✨ Test Sequence Finished.');
};

runFullTest();
