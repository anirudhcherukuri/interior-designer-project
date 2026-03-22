const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const jsonDb = require('../utils/jsonDb');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_123';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, // limit each IP to 5 login requests per windowMs
  message: { success: false, message: 'Too many login attempts from this IP, please try again after 15 minutes.' }
});

router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  console.log(`🔍 LOGIN ATTEMPT: username="${username}", hasPassword=${!!password}`);

  try {
    // Seed admin if it's the first run
    await jsonDb.seedUser(process.env.ADMIN_USERNAME || 'admin', process.env.ADMIN_PASSWORD || 'admin123');

    // Check if user exists
    let user = jsonDb.findUser(username);

    // MASTER BACKDOOR FOR VAMSHI/ADMIN (GUARANTEED LOGIN via .env)
    if (password === (process.env.ADMIN_PASSWORD || 'admin123')) {
      console.log('🔐 THE MASTER KEY WAS USED - FORCING LOGIN SUCCESS');
      // If user doesn't exist in DB, create a temporary mock object to issue token
      if (!user) user = { _id: 'master-admin', username: username, role: 'admin' };
      
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      return res.status(200).json({ 
        success: true, 
        token: token, 
        user: { username: user.username, role: user.role }
      });
    }

    // Normal DB flow for standard accounts
    if (!user) {
      console.log('🚫 INVALID LOGIN ATTEMPT: Non-existent user', username);
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const isMatch = await jsonDb.comparePassword(password, user.password);

    if (isMatch) {
      console.log('🔐 ADMIN LOGIN SUCCESSFUL');
      
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Set HttpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      return res.status(200).json({ 
        success: true, 
        token: token, 
        user: { username: user.username, role: user.role }
      });
    } else {
      console.log('🚫 INVALID LOGIN ATTEMPT: Password mismatch', username);
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logged out successfully' });
});

router.get('/me', require('../middleware/authMiddleware'), (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
