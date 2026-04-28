const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailService');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, department, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Default role is student. Admin can assign other roles later, 
        // or we can allow 'staff' registration if explicitly requested (usually restricted)
        // For now, let's allow passing role but restrict admin creation to admins? 
        // Simplest: Allow 'student' by default. 'staff' needs admin approval ideally.
        // Spec says: "Role assignment by admins after registration". 
        // So new users should probably be 'student' or 'pending'. 
        // Let's stick to default 'student' for now as per schema.

        const user = await User.create({
            name,
            email,
            password,
            department, // Optional, mainly for staff
            role: 'student' // Always force student role on open registration
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Handle get in touch submissions
// @route   POST /api/auth/contact
// @access  Public
const getInTouch = async (req, res) => {
    const { name, email, organization, requirements } = req.body;
    
    try {
        if (!name || !email || !requirements) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        
        const adminEmail = process.env.ADMIN_EMAIL || process.env.FROM_EMAIL || 'admin@campusdesk.com';
        
        const html = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h3 style="color: #1e3a8a;">New Inquiry from Campus Service Desk</h3>
                <p>A new potential customer has reached out regarding the Campus Service Desk system.</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Organization:</strong> ${organization || 'N/A'}</p>
                    <p><strong>Requirements:</strong><br/><br/>${requirements.replace(/\n/g, '<br/>')}</p>
                </div>
            </div>
        `;
        
        await sendEmail(adminEmail, `New System Inquiry from ${name}`, html);
        
        res.status(200).json({ message: 'Your request has been received. We will contact you soon.' });
    } catch (error) {
        console.error('Contact error:', error);
        res.status(500).json({ message: 'Failed to send your request. Please try again later.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getInTouch,
};
