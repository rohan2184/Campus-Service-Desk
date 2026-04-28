const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    },
    type: {
        type: String,
        enum: ['status_change', 'comment', 'assignment', 'new_ticket'],
        default: 'status_change'
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
