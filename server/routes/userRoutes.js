const express = require('express');
const router = express.Router();
const { getUsers, getStaffList, updateUserRole, toggleUserStatus, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly, staffOrAdmin } = require('../middleware/adminMiddleware');

// Staff list (for assignment dropdown) — accessible by staff & admin
router.get('/staff', protect, staffOrAdmin, getStaffList);

// Profile & Password (Any authenticated user)
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Admin-only routes
router.get('/', protect, adminOnly, getUsers);
router.put('/:id/role', protect, adminOnly, updateUserRole);
router.put('/:id/status', protect, adminOnly, toggleUserStatus);

module.exports = router;
