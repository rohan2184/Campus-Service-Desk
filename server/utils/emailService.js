const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT) || 587,
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
    }
});

/**
 * Send an email notification.
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML body
 */
const sendEmail = async (to, subject, html) => {
    if (!process.env.SMTP_USER) return; // Skip if not configured
    try {
        await transporter.sendMail({
            from: process.env.FROM_EMAIL || 'noreply@campusdesk.com',
            to,
            subject,
            html
        });
    } catch (err) {
        console.error('Email send failed:', err.message);
    }
};

module.exports = { sendEmail };
