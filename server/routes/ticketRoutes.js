const express = require('express');
const router = express.Router();
const {
    createTicket,
    getMyTickets,
    getTickets,
    getTicket,
    updateTicket,
    deleteTicket,
    submitFeedback,
    addComment
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createTicket)
    .get(protect, getTickets);

router.route('/my-tickets')
    .get(protect, getMyTickets);

router.route('/:id')
    .get(protect, getTicket)
    .put(protect, updateTicket)
    .delete(protect, deleteTicket);

router.route('/:id/feedback')
    .post(protect, submitFeedback);

router.route('/:id/comments')
    .post(protect, addComment);

module.exports = router;
