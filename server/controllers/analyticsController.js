const Ticket = require('../models/Ticket');
const User = require('../models/User');

// @desc    Get analytics data (aggregated stats for dashboards & charts)
// @route   GET /api/analytics
// @access  Admin
const getAnalytics = async (req, res) => {
    try {
        // --- Ticket Counts ---
        const allTickets = await Ticket.find({})
            .populate('assignedTo', 'name')
            .lean();

        const total = allTickets.length;
        const openCount = allTickets.filter(t => t.status === 'Open').length;
        const inProgressCount = allTickets.filter(t => t.status === 'In Progress').length;
        const resolvedCount = allTickets.filter(t => t.status === 'Completed').length;
        const closedCount = allTickets.filter(t => t.status === 'Closed').length;

        // Resolution rate
        const resolutionRate = total > 0
            ? parseFloat((((resolvedCount + closedCount) / total) * 100).toFixed(1))
            : 0;

        // --- Average Resolution Time ---
        let avgResolutionTime = 0;
        const resolvedTickets = allTickets.filter(t => t.status === 'Completed' || t.status === 'Closed');
        if (resolvedTickets.length > 0) {
            let totalMs = 0;
            let validCount = 0;
            resolvedTickets.forEach(ticket => {
                // Find the last "Completed" or status change history entry
                const resolvedEntry = [...(ticket.history || [])].reverse().find(h =>
                    h.action && (h.action.includes('Completed') || h.action.includes('Closed'))
                );
                const resolvedDate = resolvedEntry ? new Date(resolvedEntry.timestamp) : new Date(ticket.updatedAt);
                const createdDate = new Date(ticket.createdAt);
                const diff = resolvedDate - createdDate;
                if (diff > 0) {
                    totalMs += diff;
                    validCount++;
                }
            });
            if (validCount > 0) {
                // Convert ms to hours
                avgResolutionTime = parseFloat(((totalMs / validCount) / (1000 * 60 * 60)).toFixed(1));
            }
        }

        // --- Status Distribution (for Pie Chart) ---
        const statusDistribution = [
            { name: 'Open', value: openCount, color: '#EAB308' },
            { name: 'In Progress', value: inProgressCount, color: '#3B82F6' },
            { name: 'Completed', value: resolvedCount, color: '#22C55E' },
            { name: 'Closed', value: closedCount, color: '#6B7280' }
        ].filter(s => s.value > 0);

        // --- Category Breakdown (for Bar Chart) ---
        const categoryMap = {};
        allTickets.forEach(t => {
            categoryMap[t.category] = (categoryMap[t.category] || 0) + 1;
        });
        const categoryBreakdown = Object.entries(categoryMap).map(([category, count]) => ({
            category,
            count
        }));

        // --- Priority Distribution (for Horizontal Bar) ---
        const priorityMap = { Low: 0, Medium: 0, High: 0, Urgent: 0 };
        allTickets.forEach(t => {
            if (priorityMap[t.priority] !== undefined) {
                priorityMap[t.priority]++;
            }
        });
        const priorityDistribution = [
            { priority: 'Urgent', count: priorityMap.Urgent, color: '#EF4444' },
            { priority: 'High', count: priorityMap.High, color: '#F97316' },
            { priority: 'Medium', count: priorityMap.Medium, color: '#EAB308' },
            { priority: 'Low', count: priorityMap.Low, color: '#22C55E' }
        ];

        // --- Ticket Trends (Last 7 Days) ---
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        const trends = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayStart = new Date(date);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999);

            const created = allTickets.filter(t => {
                const d = new Date(t.createdAt);
                return d >= dayStart && d <= dayEnd;
            }).length;

            const resolved = allTickets.filter(t => {
                if (t.status !== 'Completed' && t.status !== 'Closed') return false;
                // Check if resolved on this day using history or updatedAt
                const resolvedEntry = (t.history || []).find(h =>
                    h.action && (h.action.includes('Completed') || h.action.includes('Closed')) &&
                    new Date(h.timestamp) >= dayStart && new Date(h.timestamp) <= dayEnd
                );
                if (resolvedEntry) return true;
                const u = new Date(t.updatedAt);
                return u >= dayStart && u <= dayEnd;
            }).length;

            trends.push({
                date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                created,
                resolved
            });
        }

        // --- Staff Performance ---
        const staffPerformance = {};
        allTickets.forEach(t => {
            if (t.assignedTo) {
                const staffId = t.assignedTo._id?.toString() || t.assignedTo.toString();
                const staffName = t.assignedTo.name || 'Unknown';
                if (!staffPerformance[staffId]) {
                    staffPerformance[staffId] = { name: staffName, resolved: 0, inProgress: 0 };
                }
                if (t.status === 'Completed' || t.status === 'Closed') {
                    staffPerformance[staffId].resolved++;
                } else if (t.status === 'In Progress') {
                    staffPerformance[staffId].inProgress++;
                }
            }
        });
        const staffPerformanceArr = Object.values(staffPerformance)
            .sort((a, b) => (b.resolved + b.inProgress) - (a.resolved + a.inProgress));

        // --- User Counts ---
        const users = await User.find({}).lean();
        const userCounts = {
            total: users.length,
            students: users.filter(u => u.role === 'student').length,
            staff: users.filter(u => u.role === 'staff').length,
            admins: users.filter(u => u.role === 'admin').length,
            active: users.filter(u => u.isActive !== false).length
        };

        res.json({
            ticketStats: {
                total,
                open: openCount,
                inProgress: inProgressCount,
                resolved: resolvedCount,
                closed: closedCount,
                resolutionRate,
                avgResolutionTime
            },
            statusDistribution,
            categoryBreakdown,
            priorityDistribution,
            trends,
            staffPerformance: staffPerformanceArr,
            userCounts
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAnalytics };
