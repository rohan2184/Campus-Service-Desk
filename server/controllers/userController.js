const User = require('../models/User');

// @desc    Get all users (with search & role filter)
// @route   GET /api/users?search=&role=
// @access  Admin
const getUsers = async (req, res) => {
    try {
        const { search, role } = req.query;
        let query = {};

        if (role && role !== 'All') {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get staff list (for ticket assignment dropdown)
// @route   GET /api/users/staff
// @access  Staff/Admin
const getStaffList = async (req, res) => {
    try {
        const staff = await User.find({
            role: { $in: ['staff', 'admin'] },
            isActive: { $ne: false }
        }).select('name email department role');

        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Admin
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!['student', 'staff', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Self-edit prevention
        if (req.params.id === req.user.id) {
            return res.status(400).json({ message: 'You cannot change your own role' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        const updated = await User.findById(user._id).select('-password');
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Toggle user active status
// @route   PUT /api/users/:id/status
// @access  Admin
const toggleUserStatus = async (req, res) => {
    try {
        // Self-deactivation prevention
        if (req.params.id === req.user.id) {
            return res.status(400).json({ message: 'You cannot deactivate your own account' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = !user.isActive;
        await user.save();

        const updated = await User.findById(user._id).select('-password');
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, department, contactInfo } = req.body;

        if (name) user.name = name;
        if (department !== undefined) user.department = department;

        if (contactInfo !== undefined) {
            user.contactInfo = contactInfo;
        }

        await user.save();
        
        const updated = await User.findById(user._id).select('-password');
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide both old and new passwords' });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if old password matches
        const isMatch = await user.matchPassword(oldPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect old password' });
        }

        // Update password (pre-save hook will hash it)
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getUsers, 
    getStaffList, 
    updateUserRole, 
    toggleUserStatus, 
    updateProfile, 
    changePassword 
};
