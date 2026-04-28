const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getInTouch } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/contact', getInTouch);
router.get('/me', protect, getMe);

module.exports = router;
