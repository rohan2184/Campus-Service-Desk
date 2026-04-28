const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { createAndEmit } = require('./notificationController');
const { sendEmail } = require('../utils/emailService');

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private (Student)
const createTicket = async (req, res) => {
    const { title, description, category, location, priority } = req.body;

    try {
        const ticket = await Ticket.create({
            requester: req.user.id,
            title,
            description,
            category,
            location,
            priority: priority || 'Low',
            status: 'Approval',
            history: [{
                action: 'Ticket Created',
                by: req.user.id
            }]
        });

        // Notify all staff and admin users about new ticket
        const staffAndAdmins = await User.find({ role: { $in: ['staff', 'admin'] }, isActive: true }).select('_id email name');
        for (const recipient of staffAndAdmins) {
            if (recipient._id.toString() !== req.user.id) {
                await createAndEmit(req.app, {
                    recipient: recipient._id,
                    message: `New ticket #${ticket.ticketID} submitted: ${title}`,
                    ticketId: ticket._id,
                    type: 'new_ticket'
                });
            }
        }

        res.status(201).json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user tickets
// @route   GET /api/tickets/my-tickets
// @access  Private
const getMyTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ requester: req.user.id })
            .populate('comments.user', 'name email role')
            .sort({ createdAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all tickets (Staff/Admin)
// @route   GET /api/tickets
// @access  Private (Staff/Admin)
const getTickets = async (req, res) => {
    try {
        let query = {};
        // Staff and Admin can see all tickets (for kanban/queue)

        const tickets = await Ticket.find(query)
            .populate('requester', 'name email role')
            .populate('assignedTo', 'name email role')
            .populate('comments.user', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('requester', 'name email role')
            .populate('assignedTo', 'name email role')
            .populate('comments.user', 'name email role')
            .populate('history.by', 'name role');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Access control: Only requester, staff, or admin can view
        if (ticket.requester._id.toString() !== req.user.id && req.user.role === 'student') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update ticket status/details
// @route   PUT /api/tickets/:id
// @access  Private (Staff/Admin/Requester for Closing)
const updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const oldStatus = ticket.status;
        const oldPriority = ticket.priority;
        const { status, priority, assignedTo, optimalCompletionTime, adminRemarks } = req.body;

        // Build history entries
        const historyEntries = [];

        // Handle assignment logic
        if (assignedTo && assignedTo !== (ticket.assignedTo?.toString() || '')) {
            if (req.user.role === 'staff') {
                return res.status(403).json({ message: 'Staff cannot re-assign tickets' });
            }

            const assignedUser = await User.findById(assignedTo).select('name email');
            const assignedName = assignedUser ? assignedUser.name : 'staff';

            historyEntries.push({
                action: `Ticket assigned to ${assignedName}`,
                by: req.user.id
            });

            ticket.assignedTo = assignedTo;

            // Auto-set status to "In Progress" if currently "Approval" or "Open"
            if ((ticket.status === 'Open' || ticket.status === 'Approval') && !status) {
                const prevStatus = ticket.status;
                ticket.status = 'In Progress';
                historyEntries.push({
                    action: `Status auto-changed from "${prevStatus}" to "In Progress" (assigned)`,
                    by: req.user.id
                });
            }

            // Notify assigned staff
            if (assignedTo !== req.user.id) {
                await createAndEmit(req.app, {
                    recipient: assignedTo,
                    message: `You have been assigned ticket #${ticket.ticketID}: ${ticket.title}`,
                    ticketId: ticket._id,
                    type: 'assignment'
                });
                // Email the assigned staff
                if (assignedUser?.email) {
                    await sendEmail(
                        assignedUser.email,
                        `Ticket Assigned: #${ticket.ticketID}`,
                        `<p>Hi ${assignedName},</p><p>You have been assigned ticket <strong>#${ticket.ticketID}: ${ticket.title}</strong>.</p>`
                    );
                }
            }
        }

        if (status && status !== oldStatus) {
            historyEntries.push({
                action: `Status changed from "${oldStatus}" to "${status}"`,
                by: req.user.id
            });
        }
        if (priority && priority !== oldPriority) {
            historyEntries.push({
                action: `Priority changed from "${oldPriority}" to "${priority}"`,
                by: req.user.id
            });
        }

        // Push history entries
        if (historyEntries.length > 0) {
            ticket.history.push(...historyEntries);
        }

        // Update fields
        if (status) ticket.status = status;
        if (priority) ticket.priority = priority;
        if (optimalCompletionTime !== undefined) ticket.optimalCompletionTime = optimalCompletionTime;
        if (adminRemarks !== undefined) ticket.adminRemarks = adminRemarks;

        const updatedTicket = await ticket.save();

        // Populate before returning
        await updatedTicket.populate('requester', 'name email role');
        await updatedTicket.populate('assignedTo', 'name email role');
        await updatedTicket.populate('comments.user', 'name email role');

        // Notify requester if status changed
        if (status && status !== oldStatus) {
            const requesterId = updatedTicket.requester._id || updatedTicket.requester;
            if (requesterId.toString() !== req.user.id) {
                await createAndEmit(req.app, {
                    recipient: requesterId,
                    message: `Ticket #${ticket.ticketID} status updated to: ${status}`,
                    ticketId: ticket._id,
                    type: 'status_change'
                });
                // Email the requester
                if (updatedTicket.requester.email) {
                    await sendEmail(
                        updatedTicket.requester.email,
                        `Ticket Status Updated: #${ticket.ticketID}`,
                        `<p>Hi ${updatedTicket.requester.name},</p><p>Your ticket <strong>#${ticket.ticketID}: ${ticket.title}</strong> status has been updated to <strong>${status}</strong>.</p>`
                    );
                }
            }
        }

        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Add comment to ticket
// @route   POST /api/tickets/:id/comments
// @access  Private
const addComment = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        // Access control: requester, staff, or admin can comment
        if (ticket.requester.toString() !== req.user.id && req.user.role === 'student') {
            return res.status(401).json({ message: 'Not authorized to comment on this ticket' });
        }

        ticket.comments.push({
            user: req.user.id,
            content: content.trim()
        });

        ticket.history.push({
            action: 'Comment added',
            by: req.user.id
        });

        await ticket.save();

        // Populate and return
        await ticket.populate('requester', 'name email role');
        await ticket.populate('comments.user', 'name email role');

        // Notify ticket requester if commenter is staff/admin
        if (ticket.requester._id.toString() !== req.user.id) {
            await createAndEmit(req.app, {
                recipient: ticket.requester._id,
                message: `New comment on your ticket #${ticket.ticketID}: "${content.trim().substring(0, 60)}${content.trim().length > 60 ? '...' : ''}"`,
                ticketId: ticket._id,
                type: 'comment'
            });
            // Email the requester
            if (ticket.requester.email) {
                await sendEmail(
                    ticket.requester.email,
                    `New Comment on Ticket #${ticket.ticketID}`,
                    `<p>Hi ${ticket.requester.name},</p><p>A new comment was added to your ticket <strong>#${ticket.ticketID}: ${ticket.title}</strong>.</p><blockquote>${content.trim()}</blockquote>`
                );
            }
        }

        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Requester only on Approval state)
const deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        if (ticket.requester.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }
        
        if (ticket.status !== 'Approval' && req.user.role !== 'admin') {
            return res.status(400).json({ message: 'Can only delete tickets in Approval state' });
        }
        
        await ticket.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit feedback for ticket
// @route   POST /api/tickets/:id/feedback
// @access  Private (Requester)
const submitFeedback = async (req, res) => {
    try {
        const { rating, feedbackText } = req.body; 
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        if (ticket.requester.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }
        if (ticket.status !== 'Review') {
            return res.status(400).json({ message: 'Feedback can only be submitted for tickets in Review state' });
        }

        let satisfactionTag = 'unresolved';
        if (rating >= 4) satisfactionTag = 'completed good';
        else if (rating === 3) satisfactionTag = 'average';
        else if (rating > 0) satisfactionTag = 'bad';

        ticket.feedback = feedbackText || '';
        ticket.satisfactionTag = satisfactionTag;
        
        const oldStatus = ticket.status;
        ticket.status = 'Closed';
        
        ticket.history.push({
            action: `Feedback submitted (${rating} stars). Status changed from "${oldStatus}" to "Closed".`,
            by: req.user.id
        });

        const updatedTicket = await ticket.save();
        await updatedTicket.populate('requester', 'name email role');
        await updatedTicket.populate('assignedTo', 'name email role');
        await updatedTicket.populate('comments.user', 'name email role');
        
        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTicket,
    getMyTickets,
    getTickets,
    getTicket,
    updateTicket,
    deleteTicket,
    submitFeedback,
    addComment
};
