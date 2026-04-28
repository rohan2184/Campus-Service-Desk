const FAQ = require('../models/FAQ');

// @desc    Get all FAQs (grouped by category optionally)
// @route   GET /api/faqs
// @access  Public or Student/Staff/Admin
const getFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find({}).sort({ createdAt: -1 });
        res.json(faqs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new FAQ
// @route   POST /api/faqs
// @access  Admin
const createFAQ = async (req, res) => {
    try {
        const { question, answer, category } = req.body;
        const faq = new FAQ({
            question,
            answer,
            category: category || 'General',
            createdBy: req.user.id
        });
        const createdFAQ = await faq.save();
        res.status(201).json(createdFAQ);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Admin
const updateFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }
        
        faq.question = req.body.question || faq.question;
        faq.answer = req.body.answer || faq.answer;
        faq.category = req.body.category || faq.category;

        const updatedFAQ = await faq.save();
        res.json(updatedFAQ);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Admin
const deleteFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }
        await faq.deleteOne();
        res.json({ message: 'FAQ removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getFAQs,
    createFAQ,
    updateFAQ,
    deleteFAQ
};
