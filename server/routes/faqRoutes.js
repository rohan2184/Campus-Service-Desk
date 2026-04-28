const express = require('express');
const router = express.Router();
const { getFAQs, createFAQ, updateFAQ, deleteFAQ } = require('../controllers/faqController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public or logged-in users can read FAQs
router.get('/', protect, getFAQs);

// Only admins can create, update, and delete FAQs
router.post('/', protect, adminOnly, createFAQ);
router.put('/:id', protect, adminOnly, updateFAQ);
router.delete('/:id', protect, adminOnly, deleteFAQ);

module.exports = router;
