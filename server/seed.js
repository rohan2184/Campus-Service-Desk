const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Ticket = require('./models/Ticket');
const Notification = require('./models/Notification');
const FAQ = require('./models/FAQ');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus-service-desk';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'campus-service-desk';
const PASSWORD = 'password123';

const departments = [
    'IT Support',
    'Facilities',
    'Academic Services',
    'Library Services',
    'Student Affairs',
    'Finance Office',
    'Hostel Administration',
    'Security',
    'Sports Complex',
    'Health Center',
];

const firstNames = [
    'Aarav', 'Aditi', 'Aditya', 'Akash', 'Aman', 'Amrita', 'Ananya', 'Anika', 'Anjali', 'Arjun',
    'Avni', 'Dev', 'Dia', 'Divya', 'Esha', 'Farhan', 'Gauri', 'Harsh', 'Ira', 'Ishaan',
    'Ishita', 'Kabir', 'Karan', 'Kavya', 'Krish', 'Leela', 'Manav', 'Meera', 'Mihir', 'Naina',
    'Neel', 'Nikhil', 'Nisha', 'Om', 'Parth', 'Pranav', 'Priya', 'Raghav', 'Rahul', 'Rhea',
    'Riya', 'Rohan', 'Saanvi', 'Sahil', 'Sakshi', 'Samaira', 'Samar', 'Sanaya', 'Sanya', 'Shaurya',
    'Shruti', 'Siddharth', 'Sneha', 'Tara', 'Tanvi', 'Ved', 'Vihaan', 'Vikram', 'Yash', 'Zara',
];

const lastNames = [
    'Agarwal', 'Bansal', 'Banerjee', 'Bhatt', 'Chandra', 'Chauhan', 'Das', 'Desai', 'Dubey', 'Fernandes',
    'Ghosh', 'Goyal', 'Gupta', 'Iyer', 'Jain', 'Joshi', 'Kapoor', 'Khan', 'Kulkarni', 'Kumar',
    'Malhotra', 'Mehta', 'Menon', 'Mishra', 'Nair', 'Patel', 'Pillai', 'Rao', 'Reddy', 'Saxena',
    'Sen', 'Sharma', 'Singh', 'Soni', 'Srivastava', 'Thakur', 'Thomas', 'Tiwari', 'Varma', 'Yadav',
];

const studentPersonas = [
    { label: 'meticulous planner', voice: 'includes exact times, room numbers, and screenshots when reporting issues' },
    { label: 'quiet researcher', voice: 'writes calmly and gives patient follow-up notes' },
    { label: 'deadline-driven multitasker', voice: 'mentions assignment deadlines and asks for practical workarounds' },
    { label: 'student club organizer', voice: 'frames issues around groups, events, and shared resources' },
    { label: 'commuter student', voice: 'cares about timing, transport, parking, and campus access' },
    { label: 'first-year explorer', voice: 'asks basic process questions and appreciates clear instructions' },
    { label: 'lab-focused tinkerer', voice: 'reports technical symptoms with device names and error messages' },
    { label: 'sports captain', voice: 'raises safety and facility issues with direct urgency' },
    { label: 'library regular', voice: 'notices quiet-zone, booking, and resource availability details' },
    { label: 'hostel resident', voice: 'reports recurring residential issues with room/block context' },
    { label: 'international student', voice: 'asks for documentation and office-process clarity' },
    { label: 'peer mentor', voice: 'mentions how an issue affects juniors or classmates' },
];

const staffPersonas = [
    { label: 'methodical troubleshooter', voice: 'documents each check before changing status' },
    { label: 'warm front-desk coordinator', voice: 'responds with reassurance and next steps' },
    { label: 'pragmatic field technician', voice: 'updates tickets with concise repair notes' },
    { label: 'policy-minded administrator', voice: 'references process, approvals, and expected timelines' },
    { label: 'student-first advisor', voice: 'adds context-sensitive guidance and confirms closure criteria' },
    { label: 'operations dispatcher', voice: 'assigns vendors, logs inspections, and tracks dependencies' },
];

const ticketTemplates = [
    {
        category: 'IT Support',
        titles: [
            'Campus WiFi keeps dropping in {place}',
            'Unable to sign in to student portal',
            'Lab desktop shows authentication error',
            'Printer queue stuck before submission deadline',
            'VPN access not working from hostel network',
            'Smart board touch input is not responding',
            'Course registration page times out repeatedly',
            'Campus email account is locked',
            'Projector HDMI input fails during class',
            'Software license unavailable in computer lab',
        ],
        places: ['Library 2nd Floor', 'Computer Lab 1', 'Computer Lab 2', 'Room 305 Block A', 'Seminar Hall', 'Boys Hostel Block D'],
        details: [
            'The issue is repeatable on multiple devices and has affected more than one student.',
            'I tried restarting, clearing cache, and using a different cable, but the problem remains.',
            'This is affecting coursework because the required online material cannot be accessed reliably.',
            'The error appears after login and then redirects back to the same page.',
        ],
    },
    {
        category: 'Facilities',
        titles: [
            'AC not working in {place}',
            'Water cooler leaking near {place}',
            'Broken chairs need replacement in {place}',
            'Power outlets are dead in {place}',
            'Elevator maintenance needed at {place}',
            'Roof leakage reported in {place}',
            'Washroom plumbing issue in {place}',
            'Lighting is poor near {place}',
            'Door lock is jammed at {place}',
            'Ceiling fan makes loud noise in {place}',
        ],
        places: ['Classroom 101', 'Room 204 Block A', 'Library Reading Room', 'Block B Entrance', 'Indoor Sports Complex', 'Girls Hostel Block A'],
        details: [
            'The issue has been present for several days and is now disrupting regular use of the space.',
            'There is a safety concern because people may trip, slip, or avoid the area after dark.',
            'A temporary fix was attempted by the floor assistant, but the problem returned.',
            'The room is used for scheduled classes, so the repair window needs coordination.',
        ],
    },
    {
        category: 'Academic Services',
        titles: [
            'Transcript copy request for internship application',
            'Grade mismatch on the portal for {place}',
            'Course registration approval pending',
            'Scholarship form download link is broken',
            'Exam result is not visible on portal',
            'ID card replacement request',
            'Request for extra tutorial sessions',
            'Attendance correction needed for {place}',
            'Lab manual upload missing for {place}',
            'Bonafide certificate request',
        ],
        places: ['Data Structures', 'Mathematics', 'Physics Lab', 'Semester 5', 'CSE Department', 'Academic Office'],
        details: [
            'The deadline is close, so I would appreciate a clear expected completion date.',
            'I have supporting documents ready and can visit the office if needed.',
            'Several classmates have reported the same discrepancy on their dashboards.',
            'The portal shows different information from the notice board update.',
        ],
    },
    {
        category: 'Other',
        titles: [
            'Canteen hygiene complaint',
            'Parking area lights are not working near {place}',
            'CCTV coverage concern at {place}',
            'Lost and found request for {place}',
            'Medical room appointment scheduling issue',
            'Club event space approval pending',
            'Fire extinguisher inspection overdue at {place}',
            'Noise complaint near {place}',
            'Security desk entry log mismatch',
            'Sports equipment checkout issue',
        ],
        places: ['Gate 1', 'Gate 2', 'Main Canteen', 'Auditorium Lobby', 'Block D Corridor', 'Sports Complex'],
        details: [
            'This affects a group of students and would be easier to solve with a campus-wide update.',
            'I am reporting this early because it could become a safety issue if ignored.',
            'The staff on duty was helpful, but the issue needs official tracking.',
            'Please let me know whether this belongs to another office if I selected the wrong category.',
        ],
    },
];

const priorityByStatus = {
    Approval: ['Low', 'Medium', 'Medium', 'High'],
    Open: ['Low', 'Medium', 'Medium', 'High', 'Urgent'],
    'In Progress': ['Medium', 'High', 'High', 'Urgent'],
    Completed: ['Low', 'Medium', 'High'],
    Review: ['Medium', 'High'],
    Closed: ['Low', 'Medium', 'High', 'Urgent'],
};

const statusFlow = {
    Approval: ['Approval'],
    Open: ['Approval', 'Open'],
    'In Progress': ['Approval', 'Open', 'In Progress'],
    Completed: ['Approval', 'Open', 'In Progress', 'Completed'],
    Review: ['Approval', 'Open', 'In Progress', 'Completed', 'Review'],
    Closed: ['Approval', 'Open', 'In Progress', 'Completed', 'Review', 'Closed'],
};

const faqData = [
    ['How do I track a ticket?', 'General', 'Open your dashboard and select My Tickets. Staff and admins can view all tickets from their ticket list.'],
    ['Why does my ticket begin in Approval?', 'General', 'New student tickets enter Approval so an admin can validate category, priority, and assignment.'],
    ['Who can assign a ticket to staff?', 'Administration', 'Admins can assign and reassign tickets. Staff can update ticket progress after assignment.'],
    ['When can feedback be submitted?', 'General', 'Feedback is available when a ticket reaches Review. Submitting feedback moves it to Closed.'],
    ['What counts as urgent?', 'General', 'Urgent issues involve safety, outages, deadlines, or campus-wide disruption.'],
    ['Can I add comments after creating a ticket?', 'General', 'Yes. The requester, assigned staff, and admins can add comments while the ticket is active.'],
    ['What should I include in IT tickets?', 'IT Support', 'Include device name, room, screenshots, exact error text, and whether others are affected.'],
    ['How do I request software installation?', 'IT Support', 'Create an IT Support ticket with lab name, software version, course, and license urgency.'],
    ['How are WiFi issues handled?', 'IT Support', 'IT staff inspect the access point, affected area, login logs, and device pattern before updating status.'],
    ['What should facilities tickets include?', 'Facilities', 'Include building, room, floor, photo if available, and whether there is a safety concern.'],
    ['Who handles hostel maintenance?', 'Facilities', 'Hostel Administration coordinates with Facilities for residential blocks.'],
    ['How do I report broken classroom equipment?', 'Facilities', 'Create a Facilities ticket and include the room, equipment type, and class schedule impact.'],
    ['How do transcript requests work?', 'Academic Services', 'Submit a ticket with purpose and deadline. Academic Services will confirm documents and pickup timing.'],
    ['How do I report a grade mismatch?', 'Academic Services', 'Attach or describe the correct marks, course name, semester, and portal value shown.'],
    ['Can tutorial sessions be requested?', 'Academic Services', 'Yes. Add the course, batch, number of affected students, and preferred times.'],
    ['How do I report canteen issues?', 'Other', 'Use Other and include date, stall, item, receipt details if available, and health or hygiene concerns.'],
    ['Can safety concerns be reported here?', 'Other', 'Yes. Mark them High or Urgent depending on immediate risk.'],
    ['What happens after a ticket is completed?', 'General', 'Completed tickets move to Review so the requester can confirm satisfaction and close the loop.'],
];

const rand = (() => {
    let seed = 20260504;
    return () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
    };
})();

const pick = (items) => items[Math.floor(rand() * items.length)];
const pad = (value, width) => String(value).padStart(width, '0');
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/(^\.|\.$)/g, '');
const daysAgo = (days, hour = 10) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(hour, Math.floor(rand() * 60), 0, 0);
    return date;
};

const addHours = (date, hours) => new Date(date.getTime() + hours * 60 * 60 * 1000);

const makeUser = ({ name, email, role, department, contactInfo, persona, password, isActive }) => ({
    name,
    email,
    password,
    role,
    department,
    contactInfo,
    avatar: '',
    isActive: typeof isActive === 'boolean' ? isActive : rand() > 0.04,
    persona,
});

const makeUsers = async () => {
    const hashedPassword = await bcrypt.hash(PASSWORD, 10);
    const users = [
        makeUser({
            name: 'CSD Student Demo',
            email: 'students@csd.edu',
            password: hashedPassword,
            role: 'student',
            contactInfo: '9700000001',
            persona: studentPersonas[0],
            isActive: true,
        }),
        makeUser({
            name: 'CSD Staff Demo',
            email: 'staff@csd.edu',
            password: hashedPassword,
            role: 'staff',
            department: 'IT Support',
            contactInfo: '9800000001',
            persona: staffPersonas[0],
            isActive: true,
        }),
        makeUser({
            name: 'CSD Admin Demo',
            email: 'admin@csd.edu',
            password: hashedPassword,
            role: 'admin',
            department: 'Administration',
            contactInfo: '9900000001',
            persona: staffPersonas[3],
            isActive: true,
        }),
    ];

    for (let i = 1; i <= 5; i++) {
        const name = `${pick(firstNames)} ${pick(lastNames)}`;
        users.push(makeUser({
            name,
            email: `admin.${pad(i, 2)}@csd.edu`,
            password: hashedPassword,
            role: 'admin',
            department: 'Administration',
            contactInfo: `99${pad(10000000 + i, 8)}`,
            persona: pick(staffPersonas),
        }));
    }

    for (let i = 1; i <= 42; i++) {
        const name = `${pick(firstNames)} ${pick(lastNames)}`;
        const department = departments[(i - 1) % departments.length];
        users.push(makeUser({
            name,
            email: `${slug(name)}.${pad(i, 3)}@staff.csd.edu`,
            password: hashedPassword,
            role: 'staff',
            department,
            contactInfo: `98${pad(20000000 + i, 8)}`,
            persona: pick(staffPersonas),
        }));
    }

    for (let i = 1; i <= 150; i++) {
        const name = `${pick(firstNames)} ${pick(lastNames)}`;
        users.push(makeUser({
            name,
            email: `${slug(name)}.${pad(i, 3)}@student.csd.edu`,
            password: hashedPassword,
            role: 'student',
            contactInfo: `97${pad(30000000 + i, 8)}`,
            persona: pick(studentPersonas),
        }));
    }

    return users;
};

const makeHistory = (flow, actors, createdAt) => {
    const actions = [];
    const timestamps = [];
    flow.forEach((state, index) => {
        const timestamp = addHours(createdAt, index * (8 + Math.floor(rand() * 16)));
        timestamps.push({ state, timestamp });

        if (index === 0) {
            actions.push({ action: 'Ticket Created', by: actors.requester._id, timestamp });
            return;
        }

        const previous = flow[index - 1];
        const by = state === 'Open' ? actors.admin._id : (actors.staff?._id || actors.admin._id);
        actions.push({ action: `Status changed from "${previous}" to "${state}"`, by, timestamp });
    });

    if (actors.staff) {
        actions.splice(2, 0, {
            action: `Ticket assigned to ${actors.staff.name}`,
            by: actors.admin._id,
            timestamp: addHours(createdAt, 6),
        });
    }

    return { history: actions, stateEntryTimestamps: timestamps };
};

const makeComments = ({ requester, staff, admin, status, createdAt, template }) => {
    const comments = [];
    const requesterTone = requester.persona?.voice || 'shares useful context';
    comments.push({
        user: requester._id,
        content: `Context from requester: ${requesterTone}. ${pick(template.details)}`,
        createdAt: addHours(createdAt, 1),
        updatedAt: addHours(createdAt, 1),
    });

    if (['In Progress', 'Completed', 'Review', 'Closed'].includes(status) && staff) {
        comments.push({
            user: staff._id,
            content: `${staff.persona?.label || 'Staff'} update: initial checks are logged and the next action is scheduled with ${staff.department || 'the assigned team'}.`,
            createdAt: addHours(createdAt, 10),
            updatedAt: addHours(createdAt, 10),
        });
    }

    if (['Completed', 'Review', 'Closed'].includes(status) && staff) {
        comments.push({
            user: staff._id,
            content: `Work completed. Please review the result and confirm whether this can be closed.`,
            createdAt: addHours(createdAt, 34),
            updatedAt: addHours(createdAt, 34),
        });
    }

    if (status === 'Closed') {
        comments.push({
            user: requester._id,
            content: pick([
                'Confirmed, this is working now. Thank you for the quick help.',
                'The issue is resolved from my side. Closing this ticket.',
                'Everything looks good now. The follow-up notes were helpful.',
                'Resolved. I appreciate the clear updates through the process.',
            ]),
            createdAt: addHours(createdAt, 42),
            updatedAt: addHours(createdAt, 42),
        });
    }

    if (rand() > 0.72) {
        comments.push({
            user: admin._id,
            content: 'Admin note: priority, owner, and service impact reviewed for reporting.',
            createdAt: addHours(createdAt, 12),
            updatedAt: addHours(createdAt, 12),
        });
    }

    return comments.sort((a, b) => a.createdAt - b.createdAt);
};

const makeTickets = (users) => {
    const admins = users.filter((user) => user.role === 'admin');
    const staff = users.filter((user) => user.role === 'staff' && user.isActive !== false);
    const students = users.filter((user) => user.role === 'student' && user.isActive !== false);
    const allRequesters = [...students, ...staff.slice(0, 18), ...admins.slice(0, 2)];
    const statusPlan = [
        ...Array(70).fill('Approval'),
        ...Array(95).fill('Open'),
        ...Array(150).fill('In Progress'),
        ...Array(125).fill('Completed'),
        ...Array(70).fill('Review'),
        ...Array(140).fill('Closed'),
    ];

    return statusPlan.map((status, index) => {
        const requester = allRequesters[index % allRequesters.length];
        const template = ticketTemplates[index % ticketTemplates.length];
        const place = pick(template.places);
        const assignedStaff = status === 'Approval' || (status === 'Open' && rand() > 0.65)
            ? null
            : staff.find((member) => member.department === template.category) || pick(staff);
        const admin = admins[index % admins.length];
        const createdAt = daysAgo(75 - (index % 76), 8 + (index % 10));
        const flow = statusFlow[status];
        const { history, stateEntryTimestamps } = makeHistory(flow, { requester, staff: assignedStaff, admin }, createdAt);
        const priority = pick(priorityByStatus[status]);
        const ticketType = requester.role === 'admin'
            ? 'Admin Generated'
            : requester.role === 'staff' ? 'Staff Generated' : 'Student Generated';
        const resolutionDate = stateEntryTimestamps.find((entry) => entry.state === 'Completed')?.timestamp;
        const title = pick(template.titles).replace('{place}', place);
        const description = [
            `${requester.name} is a ${requester.persona?.label || 'campus user'} who ${requester.persona?.voice || 'provided the issue details'}.`,
            pick(template.details),
            `Location/context: ${place}. This was seeded as varied demo data for dashboard, analytics, and workflow testing.`,
        ].join(' ');

        const ticket = {
            ticketID: `CSD-${pad(index + 1, 6)}`,
            requester: requester._id,
            title: title.slice(0, 100),
            description,
            category: template.category,
            location: place,
            priority,
            status,
            ticketType,
            assignedTo: assignedStaff?._id,
            optimalCompletionTime: addHours(createdAt, priority === 'Urgent' ? 8 : priority === 'High' ? 24 : priority === 'Medium' ? 72 : 120),
            adminRemarks: rand() > 0.58 ? `Seeded admin review: ${priority} priority accepted for ${template.category}.` : '',
            feedback: ['Review', 'Closed'].includes(status) ? pick([
                'The response was clear and timely.',
                'Good communication, but the first estimate changed.',
                'The fix worked after one follow-up visit.',
                'The team explained the process well.',
                'The final outcome was acceptable.',
            ]) : '',
            satisfactionTag: status === 'Closed' ? pick(['completed good', 'completed good', 'average', 'bad', 'unresolved']) : undefined,
            stateEntryTimestamps,
            attachments: rand() > 0.78 ? [`/uploads/seed-${pad(index + 1, 4)}.png`] : [],
            comments: makeComments({ requester, staff: assignedStaff, admin, status, createdAt, template }),
            history,
            createdAt,
            updatedAt: resolutionDate || addHours(createdAt, 18 + Math.floor(rand() * 72)),
        };

        if (!ticket.assignedTo) {
            delete ticket.assignedTo;
        }
        if (!ticket.satisfactionTag) {
            delete ticket.satisfactionTag;
        }

        return ticket;
    });
};

const makeNotifications = (tickets) => {
    const notifications = [];

    tickets.forEach((ticket, index) => {
        if (index % 2 === 0) {
            notifications.push({
                recipient: ticket.requester,
                ticketId: ticket._id,
                type: 'status_change',
                message: `Ticket #${ticket.ticketID} status updated to: ${ticket.status}`,
                read: rand() > 0.42,
                createdAt: ticket.updatedAt,
                updatedAt: ticket.updatedAt,
            });
        }

        if (ticket.assignedTo && index % 3 === 0) {
            notifications.push({
                recipient: ticket.assignedTo,
                ticketId: ticket._id,
                type: 'assignment',
                message: `Ticket #${ticket.ticketID} has been assigned for follow-up.`,
                read: rand() > 0.35,
                createdAt: addHours(ticket.createdAt, 6),
                updatedAt: addHours(ticket.createdAt, 6),
            });
        }

        if (ticket.comments.length > 1 && index % 4 === 0) {
            notifications.push({
                recipient: ticket.requester,
                ticketId: ticket._id,
                type: 'comment',
                message: `New comment on ticket #${ticket.ticketID}: ${ticket.title}`,
                read: rand() > 0.55,
                createdAt: ticket.comments[ticket.comments.length - 1].createdAt,
                updatedAt: ticket.comments[ticket.comments.length - 1].createdAt,
            });
        }
    });

    return notifications;
};

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: MONGO_DB_NAME,
        });
        const serverStatus = await mongoose.connection.db.admin().serverStatus();
        console.log(`Connected to MongoDB ${serverStatus.version} at ${mongoose.connection.host}/${mongoose.connection.name}`);

        await Promise.all([
            User.deleteMany({}),
            Ticket.deleteMany({}),
            Notification.deleteMany({}),
            FAQ.deleteMany({}),
        ]);
        console.log('Cleared existing users, tickets, notifications, and FAQs');

        const usersToInsert = await makeUsers();
        const insertedUsers = await User.insertMany(usersToInsert, { ordered: true });
        const users = insertedUsers.map((user, index) => ({
            ...user.toObject(),
            persona: usersToInsert[index].persona,
        }));
        const ticketsToInsert = makeTickets(users);
        const tickets = await Ticket.insertMany(ticketsToInsert, { ordered: true });
        const notifications = await Notification.insertMany(makeNotifications(tickets), { ordered: true });
        const faqs = await FAQ.insertMany(faqData.map(([question, category, answer], index) => ({
            question,
            category,
            answer,
            createdBy: users.find((user) => user.role === 'admin')._id,
            createdAt: daysAgo(20 - (index % 20), 9),
            updatedAt: daysAgo(20 - (index % 20), 9),
        })));

        const roleCounts = await User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]);
        const statusCounts = await Ticket.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
        console.log('Seed complete');
        console.log(`Users: ${users.length}`, roleCounts);
        console.log(`Tickets: ${tickets.length}`, statusCounts);
        console.log(`Notifications: ${notifications.length}`);
        console.log(`FAQs: ${faqs.length}`);
        console.log('Required login users:');
        console.log(`  students@csd.edu / ${PASSWORD}`);
        console.log(`  staff@csd.edu / ${PASSWORD}`);
        console.log(`  admin@csd.edu / ${PASSWORD}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seedData();
