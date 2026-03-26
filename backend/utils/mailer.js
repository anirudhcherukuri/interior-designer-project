const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'italianinteriors93@gmail.com',
    pass: process.env.EMAIL_PASS // User should provide an App Password
  }
});

const sendResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin?token=${token}`;
  
  const mailOptions = {
    from: `"Italian Interiors" <${process.env.EMAIL_USER || 'italianinteriors93@gmail.com'}>`,
    to: email,
    subject: 'Password Reset Request - Italian Interiors Dashboard',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #C8963E; border-radius: 10px;">
        <h2 style="color: #2C1A0E; text-align: center;">Password Reset Request</h2>
        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #C8963E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888;">Italian Interiors Dashboard - Studio Console</p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

const sendContactNotificationEmail = async (contactData) => {
  const adminEmail = process.env.ADMIN_USERNAME || 'italianinteriors93@gmail.com';
  
  const mailOptions = {
    from: `"Italian Interiors Website" <${process.env.EMAIL_USER || 'italianinteriors93@gmail.com'}>`,
    to: adminEmail,
    subject: `New Enquiry from ${contactData.name || contactData.clientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2C1A0E;">
        <h2 style="color: #C8963E; border-bottom: 2px solid #C8963E; padding-bottom: 15px;">New Website Contact Request</h2>
        <div style="background: #F5EFE6; padding: 25px; border-radius: 12px; border-left: 5px solid #C8963E;">
          <p><strong>Name:</strong> ${contactData.name || contactData.clientName}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Phone:</strong> ${contactData.phone || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <div style="background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #D4A843; font-style: italic;">
            "${contactData.message}"
          </div>
          <p style="margin-top: 20px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin" style="color: #C8963E; text-decoration: none; font-weight: bold;">→ View in Dashboard</a>
          </p>
        </div>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

const sendBookingNotificationEmail = async (bookingData) => {
  const adminEmail = process.env.ADMIN_USERNAME || 'italianinteriors93@gmail.com';
  
  const mailOptions = {
    from: `"Italian Interiors Website" <${process.env.EMAIL_USER || 'italianinteriors93@gmail.com'}>`,
    to: adminEmail,
    subject: `New Booking Request: ${bookingData.clientName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #2C1A0E;">
        <h2 style="color: #C8963E; border-bottom: 2px solid #C8963E; padding-bottom: 15px;">New Booking Request</h2>
        <div style="background: #F5EFE6; padding: 25px; border-radius: 12px; border-left: 5px solid #C8963E;">
          <p><strong>Client:</strong> ${bookingData.clientName}</p>
          <p><strong>Service:</strong> ${bookingData.serviceType || 'Consultation'}</p>
          <p><strong>Requested Date:</strong> ${bookingData.bookingDate || 'N/A'}</p>
          <p><strong>Time Slot:</strong> ${bookingData.bookingTime || 'N/A'}</p>
          <p><strong>Phone:</strong> ${bookingData.phone || 'N/A'}</p>
          <p><strong>Email:</strong> ${bookingData.email || 'N/A'}</p>
          <p style="margin-top: 20px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin" style="color: #C8963E; text-decoration: none; font-weight: bold;">→ Open Dashboard to Confirm</a>
          </p>
        </div>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { 
  sendResetEmail, 
  sendContactNotificationEmail, 
  sendBookingNotificationEmail 
};
