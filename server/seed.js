const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Ticket = require('./models/Ticket');
const Notification = require('./models/Notification');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campus-service-desk';

const seedData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('🔌 Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Ticket.deleteMany({});
        await Notification.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // ============ USERS ============

        // Admin (1)
        const admin = await User.create({
            name: 'Rohan Upadhyay',
            email: 'rohan@campus.edu',
            password: 'password123',
            role: 'admin',
            department: 'Administration',
            contactInfo: '9876543210'
        });

        // Staff (15)
        const staffData = [
            { name: 'Priya Sharma', email: 'priya@campus.edu', department: 'IT Support' },
            { name: 'Vikram Singh', email: 'vikram@campus.edu', department: 'IT Support' },
            { name: 'Anita Desai', email: 'anita@campus.edu', department: 'Facilities' },
            { name: 'Rajesh Gupta', email: 'rajesh.g@campus.edu', department: 'Facilities' },
            { name: 'Meena Iyer', email: 'meena@campus.edu', department: 'Academic Services' },
            { name: 'Suresh Nair', email: 'suresh@campus.edu', department: 'IT Support' },
            { name: 'Kavita Joshi', email: 'kavita@campus.edu', department: 'Library Services' },
            { name: 'Deepak Rao', email: 'deepak@campus.edu', department: 'Facilities' },
            { name: 'Sunita Kulkarni', email: 'sunita@campus.edu', department: 'Academic Services' },
            { name: 'Manoj Tiwari', email: 'manoj@campus.edu', department: 'IT Support' },
            { name: 'Neha Agarwal', email: 'neha.a@campus.edu', department: 'Student Affairs' },
            { name: 'Sanjay Verma', email: 'sanjay@campus.edu', department: 'Facilities' },
            { name: 'Pooja Reddy', email: 'pooja@campus.edu', department: 'IT Support' },
            { name: 'Arun Menon', email: 'arun@campus.edu', department: 'Academic Services' },
            { name: 'Lakshmi Pillai', email: 'lakshmi@campus.edu', department: 'Library Services' },
        ];

        const staffUsers = [];
        for (const s of staffData) {
            const user = await User.create({
                ...s,
                password: 'password123',
                role: 'staff',
                contactInfo: '98' + Math.floor(10000000 + Math.random() * 90000000)
            });
            staffUsers.push(user);
        }

        // Students (25)
        const studentData = [
            { name: 'Amit Kumar', email: 'amit@campus.edu' },
            { name: 'Sneha Patel', email: 'sneha@campus.edu' },
            { name: 'Raj Mehta', email: 'raj@campus.edu' },
            { name: 'Divya Krishnan', email: 'divya@campus.edu' },
            { name: 'Arjun Nair', email: 'arjun@campus.edu' },
            { name: 'Riya Saxena', email: 'riya@campus.edu' },
            { name: 'Karan Malhotra', email: 'karan@campus.edu' },
            { name: 'Ishita Banerjee', email: 'ishita@campus.edu' },
            { name: 'Nikhil Jain', email: 'nikhil@campus.edu' },
            { name: 'Tanvi Deshmukh', email: 'tanvi@campus.edu' },
            { name: 'Harsh Pandey', email: 'harsh@campus.edu' },
            { name: 'Megha Soni', email: 'megha@campus.edu' },
            { name: 'Varun Chauhan', email: 'varun@campus.edu' },
            { name: 'Shweta Mishra', email: 'shweta@campus.edu' },
            { name: 'Aman Bhatt', email: 'aman@campus.edu' },
            { name: 'Nisha Goyal', email: 'nisha@campus.edu' },
            { name: 'Rohit Kapoor', email: 'rohit@campus.edu' },
            { name: 'Anjali Thakur', email: 'anjali@campus.edu' },
            { name: 'Siddharth Pawar', email: 'siddharth@campus.edu' },
            { name: 'Pooja Bhardwaj', email: 'pooja.b@campus.edu' },
            { name: 'Gaurav Yadav', email: 'gaurav@campus.edu' },
            { name: 'Sakshi Dubey', email: 'sakshi@campus.edu' },
            { name: 'Manish Rawat', email: 'manish@campus.edu' },
            { name: 'Priyanka Choudhary', email: 'priyanka@campus.edu' },
            { name: 'Akash Srivastava', email: 'akash@campus.edu' },
        ];

        const studentUsers = [];
        for (const s of studentData) {
            const user = await User.create({
                ...s,
                password: 'password123',
                role: 'student',
                contactInfo: '97' + Math.floor(10000000 + Math.random() * 90000000)
            });
            studentUsers.push(user);
        }

        console.log(`👥 Created ${1 + staffUsers.length + studentUsers.length} users (1 admin, ${staffUsers.length} staff, ${studentUsers.length} students)`);

        // Shortcuts
        const staff = staffUsers[0]; // Priya
        const staff2 = staffUsers[1]; // Vikram
        const staff3 = staffUsers[2]; // Anita
        const st = studentUsers; // shorthand for students array

        // ============ TICKETS ============
        const ticketsData = [
            {
                requester: st[0]._id,
                title: 'WiFi not working in Library',
                description: 'The WiFi connection in the main library (2nd floor) has been dropping intermittently since yesterday. Multiple students are affected and unable to access online resources for assignments.',
                category: 'IT Support',
                location: 'Library, 2nd Floor',
                priority: 'Urgent',
                status: 'In Progress',
                assignedTo: staff._id,
                comments: [
                    { user: staff._id, content: 'I am looking into this. The access point on 2nd floor seems to need a restart.' },
                    { user: st[0]._id, content: 'Thank you! It is still very slow though.' },
                    { user: staff._id, content: 'We have escalated this to the network team. A technician will visit today.' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[0]._id },
                    { action: 'Status changed from "Open" to "In Progress"', by: staff._id },
                    { action: 'Ticket assigned to staff', by: admin._id }
                ]
            },
            {
                requester: st[1]._id,
                title: 'Projector broken in Lecture Hall 3',
                description: 'The projector in Lecture Hall 3 is not displaying anything. Tried multiple laptops and HDMI cables. The power LED is on but no image is projected.',
                category: 'Facilities',
                location: 'Lecture Hall 3',
                priority: 'High',
                status: 'Open',
                comments: [
                    { user: st[1]._id, content: 'The professor had to cancel the presentation today because of this.' }
                ],
                history: [{ action: 'Ticket Created', by: st[1]._id }]
            },
            {
                requester: st[2]._id,
                title: 'Cannot access exam results on portal',
                description: 'I am unable to view my semester 5 exam results on the student portal. It shows "Results not found" even though results have been declared.',
                category: 'Academic Services',
                location: 'Online Portal',
                priority: 'High',
                status: 'Open',
                comments: [],
                history: [{ action: 'Ticket Created', by: st[2]._id }]
            },
            {
                requester: st[0]._id,
                title: 'Request for new lab software installation',
                description: 'We need MATLAB R2025 installed on Computer Lab 2 machines for Digital Signal Processing coursework. The current version is outdated.',
                category: 'IT Support',
                location: 'Computer Lab 2',
                priority: 'Medium',
                status: 'Open',
                comments: [
                    { user: admin._id, content: 'We will check the license availability and schedule the installation.' }
                ],
                history: [{ action: 'Ticket Created', by: st[0]._id }]
            },
            {
                requester: st[1]._id,
                title: 'Air conditioning not working in Room 204',
                description: 'The AC unit in Room 204 has stopped working. The classroom becomes extremely hot during afternoon sessions.',
                category: 'Facilities',
                location: 'Room 204, Block A',
                priority: 'Medium',
                status: 'In Progress',
                assignedTo: staff3._id,
                comments: [
                    { user: staff3._id, content: 'Maintenance team has been notified. They will inspect tomorrow.' },
                    { user: st[1]._id, content: 'Can you also check Room 205? The AC there is making loud noises.' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[1]._id },
                    { action: 'Status changed from "Open" to "In Progress"', by: staff3._id }
                ]
            },
            {
                requester: st[2]._id,
                title: 'Library book reservation system bug',
                description: 'The online library book reservation system shows books as available but reservation fails with "Book already reserved".',
                category: 'IT Support',
                location: 'Online',
                priority: 'Low',
                status: 'Resolved',
                assignedTo: staff._id,
                comments: [
                    { user: staff._id, content: 'This was a caching issue. It has been fixed now.' },
                    { user: st[2]._id, content: 'Confirmed, working fine now. Thanks!' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[2]._id },
                    { action: 'Status changed from "Open" to "In Progress"', by: staff._id },
                    { action: 'Status changed from "In Progress" to "Resolved"', by: staff._id }
                ]
            },
            {
                requester: st[0]._id,
                title: 'Request for transcript copy',
                description: 'I need an official transcript copy for my internship application. Please guide me on the process.',
                category: 'Academic Services',
                location: 'Admin Office',
                priority: 'Low',
                status: 'Closed',
                assignedTo: staffUsers[4]._id,
                comments: [
                    { user: staffUsers[4]._id, content: 'Please visit the academic office with your ID card. Ready in 3 working days.' },
                    { user: st[0]._id, content: 'Got it, thank you!' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[0]._id },
                    { action: 'Status changed from "Open" to "Resolved"', by: staffUsers[4]._id },
                    { action: 'Status changed from "Resolved" to "Closed"', by: st[0]._id }
                ]
            },
            {
                requester: st[3]._id,
                title: 'Broken chair in Classroom 101',
                description: 'There are 3 broken chairs in Classroom 101. One has a broken backrest and two have wobbly legs.',
                category: 'Facilities',
                location: 'Classroom 101, Block B',
                priority: 'Low',
                status: 'Open',
                comments: [],
                history: [{ action: 'Ticket Created', by: st[3]._id }]
            },
            {
                requester: st[4]._id,
                title: 'Printer not working in Computer Lab 1',
                description: 'The HP LaserJet printer shows "Paper Jam" error but there is no jam visible. Students cannot print assignments.',
                category: 'IT Support',
                location: 'Computer Lab 1',
                priority: 'High',
                status: 'In Progress',
                assignedTo: staff2._id,
                comments: [
                    { user: staff2._id, content: 'Looking into it. The sensor might need cleaning.' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[4]._id },
                    { action: 'Status changed from "Open" to "In Progress"', by: staff2._id }
                ]
            },
            {
                requester: st[5]._id,
                title: 'Hostel water heater not functioning',
                description: 'The water heater in Girls Hostel Block A, 2nd floor bathroom has stopped working for 2 days.',
                category: 'Facilities',
                location: 'Girls Hostel, Block A, 2nd Floor',
                priority: 'Medium',
                status: 'Resolved',
                assignedTo: staff3._id,
                comments: [
                    { user: staff3._id, content: 'The heating element was faulty. It has been replaced.' },
                    { user: st[5]._id, content: 'Working perfectly now, thanks!' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[5]._id },
                    { action: 'Status changed from "Open" to "In Progress"', by: staff3._id },
                    { action: 'Status changed from "In Progress" to "Resolved"', by: staff3._id }
                ]
            },
            {
                requester: st[6]._id,
                title: 'Course registration portal timing out',
                description: 'During the course registration window, the portal keeps timing out. The add-drop deadline is approaching.',
                category: 'Academic Services',
                location: 'Online Portal',
                priority: 'Urgent',
                status: 'Resolved',
                assignedTo: staff._id,
                comments: [
                    { user: staff._id, content: 'Server was overloaded. We have added additional capacity.' },
                    { user: st[6]._id, content: 'Much faster now. Registered successfully.' },
                    { user: admin._id, content: 'We will monitor during the next registration window.' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[6]._id },
                    { action: 'Priority changed from "High" to "Urgent"', by: admin._id },
                    { action: 'Status changed from "Open" to "In Progress"', by: staff._id },
                    { action: 'Status changed from "In Progress" to "Resolved"', by: staff._id }
                ]
            },
            {
                requester: st[7]._id,
                title: 'Parking area lights not working',
                description: 'The lights in the student parking area near Gate 2 have been off for the past week. Very dark and unsafe at night.',
                category: 'Other',
                location: 'Parking Area, Gate 2',
                priority: 'Medium',
                status: 'Open',
                comments: [],
                history: [{ action: 'Ticket Created', by: st[7]._id }]
            },
            {
                requester: st[8]._id,
                title: 'Laptop charging points not working in Reading Room',
                description: 'Multiple power outlets in the library reading room are not providing power. Students cannot charge laptops while studying.',
                category: 'Facilities',
                location: 'Library Reading Room',
                priority: 'Medium',
                status: 'Open',
                comments: [
                    { user: st[8]._id, content: 'At least 6 out of 10 charging points on the left side are dead.' }
                ],
                history: [{ action: 'Ticket Created', by: st[8]._id }]
            },
            {
                requester: st[9]._id,
                title: 'Student ID card replacement',
                description: 'I lost my student ID card and need a replacement. What is the procedure and cost?',
                category: 'Academic Services',
                location: 'Admin Office',
                priority: 'Low',
                status: 'Resolved',
                assignedTo: staffUsers[4]._id,
                comments: [
                    { user: staffUsers[4]._id, content: 'Please submit a written application with a passport photo and Rs. 200 fee at the admin office.' },
                    { user: st[9]._id, content: 'Done. When can I collect it?' },
                    { user: staffUsers[4]._id, content: 'It will be ready in 5 working days. You will receive an SMS notification.' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[9]._id },
                    { action: 'Status changed from "Open" to "In Progress"', by: staffUsers[4]._id },
                    { action: 'Status changed from "In Progress" to "Resolved"', by: staffUsers[4]._id }
                ]
            },
            {
                requester: st[10]._id,
                title: 'Slow internet in Boys Hostel Block D',
                description: 'Internet speed in Boys Hostel Block D has been extremely slow for the past 3 days. Speed test shows less than 1 Mbps.',
                category: 'IT Support',
                location: 'Boys Hostel, Block D',
                priority: 'High',
                status: 'In Progress',
                assignedTo: staffUsers[5]._id,
                comments: [
                    { user: staffUsers[5]._id, content: 'We are investigating. May be a bandwidth issue during peak hours.' },
                    { user: st[10]._id, content: 'It is slow even at 2 AM.' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[10]._id },
                    { action: 'Status changed from "Open" to "In Progress"', by: staffUsers[5]._id }
                ]
            },
            {
                requester: st[11]._id,
                title: 'Canteen hygiene complaint',
                description: 'Found insects in the food served at the main canteen yesterday. Multiple students fell sick. This needs urgent attention.',
                category: 'Other',
                location: 'Main Canteen',
                priority: 'Urgent',
                status: 'In Progress',
                assignedTo: staffUsers[10]._id,
                comments: [
                    { user: staffUsers[10]._id, content: 'We are taking this very seriously. An inspection has been ordered.' },
                    { user: admin._id, content: 'The canteen vendor has been issued a warning. Health inspector visit scheduled for tomorrow.' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[11]._id },
                    { action: 'Priority changed from "High" to "Urgent"', by: admin._id },
                    { action: 'Status changed from "Open" to "In Progress"', by: staffUsers[10]._id }
                ]
            },
            {
                requester: st[12]._id,
                title: 'Science lab equipment calibration needed',
                description: 'The oscilloscopes in Physics Lab need calibration. Readings are inaccurate and affecting experiment results.',
                category: 'Facilities',
                location: 'Physics Lab, Block C',
                priority: 'Medium',
                status: 'Open',
                assignedTo: staff3._id,
                comments: [],
                history: [{ action: 'Ticket Created', by: st[12]._id }]
            },
            {
                requester: st[13]._id,
                title: 'Email account locked',
                description: 'My campus email account has been locked after multiple failed login attempts. I need it for assignment submissions.',
                category: 'IT Support',
                location: 'Online',
                priority: 'High',
                status: 'Resolved',
                assignedTo: staff2._id,
                comments: [
                    { user: staff2._id, content: 'Your account has been unlocked. Please reset your password using the portal.' },
                    { user: st[13]._id, content: 'Thank you, I can access it now.' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[13]._id },
                    { action: 'Status changed from "Open" to "In Progress"', by: staff2._id },
                    { action: 'Status changed from "In Progress" to "Resolved"', by: staff2._id }
                ]
            },
            {
                requester: st[14]._id,
                title: 'Drinking water cooler leaking',
                description: 'The water cooler near the entrance of Block B is leaking continuously, creating a puddle and safety hazard.',
                category: 'Facilities',
                location: 'Block B Entrance',
                priority: 'Medium',
                status: 'Closed',
                assignedTo: staff3._id,
                comments: [
                    { user: staff3._id, content: 'The plumber has fixed the leak. The old pipe fitting was replaced.' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[14]._id },
                    { action: 'Status changed from "Open" to "In Progress"', by: staff3._id },
                    { action: 'Status changed from "In Progress" to "Resolved"', by: staff3._id },
                    { action: 'Status changed from "Resolved" to "Closed"', by: admin._id }
                ]
            },
            {
                requester: st[15]._id,
                title: 'Scholarship form download not working',
                description: 'The scholarship application form PDF on the university website gives a 404 error when trying to download.',
                category: 'Academic Services',
                location: 'Online',
                priority: 'High',
                status: 'Resolved',
                assignedTo: staff._id,
                comments: [
                    { user: staff._id, content: 'The link has been fixed. Please try downloading again.' },
                    { user: st[15]._id, content: 'Works now, thanks!' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[15]._id },
                    { action: 'Status changed from "Open" to "Resolved"', by: staff._id }
                ]
            },
            {
                requester: st[16]._id,
                title: 'Smart board malfunction in Room 305',
                description: 'The interactive smart board in Room 305 is unresponsive to touch. It displays content but touch input does not work.',
                category: 'IT Support',
                location: 'Room 305, Block A',
                priority: 'Medium',
                status: 'Open',
                comments: [],
                history: [{ action: 'Ticket Created', by: st[16]._id }]
            },
            {
                requester: st[17]._id,
                title: 'Elevator stuck between floors',
                description: 'The elevator in Block A got stuck between 2nd and 3rd floor today with students inside. It took 20 minutes to rescue.',
                category: 'Facilities',
                location: 'Block A Elevator',
                priority: 'Urgent',
                status: 'In Progress',
                assignedTo: staffUsers[3]._id,
                comments: [
                    { user: staffUsers[3]._id, content: 'Elevator has been shut down for maintenance. The lift company technician is on site.' },
                    { user: admin._id, content: 'All elevators in Block A will undergo safety inspection this week.' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[17]._id },
                    { action: 'Status changed from "Open" to "In Progress"', by: staffUsers[3]._id }
                ]
            },
            {
                requester: st[18]._id,
                title: 'Request for extra tutorial sessions',
                description: 'Many students in CSE 3rd year are struggling with Data Structures. Can the department arrange extra tutorial sessions?',
                category: 'Academic Services',
                location: 'CSE Department',
                priority: 'Low',
                status: 'Open',
                comments: [
                    { user: st[19]._id, content: 'I agree, we really need extra sessions before the mid-term exams.' }
                ],
                history: [{ action: 'Ticket Created', by: st[18]._id }]
            },
            {
                requester: st[20]._id,
                title: 'CCTV camera blind spots in parking lot',
                description: 'Two-wheeler thefts have been reported in the parking area. Several CCTV cameras seem to have blind spots.',
                category: 'Other',
                location: 'Two-Wheeler Parking, Gate 1',
                priority: 'High',
                status: 'Open',
                comments: [
                    { user: st[20]._id, content: 'My friend also lost his bike side mirror last week.' }
                ],
                history: [{ action: 'Ticket Created', by: st[20]._id }]
            },
            {
                requester: st[21]._id,
                title: 'VPN access for remote lab work',
                description: 'I need VPN access configured to connect to the campus network from my hostel for accessing licensed software remotely.',
                category: 'IT Support',
                location: 'Remote',
                priority: 'Medium',
                status: 'Resolved',
                assignedTo: staffUsers[9]._id,
                comments: [
                    { user: staffUsers[9]._id, content: 'VPN credentials have been sent to your campus email. Follow the setup guide attached.' },
                    { user: st[21]._id, content: 'Connected successfully. Thank you!' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[21]._id },
                    { action: 'Status changed from "Open" to "Resolved"', by: staffUsers[9]._id }
                ]
            },
            {
                requester: st[22]._id,
                title: 'Leaking roof in Sports Room',
                description: 'The roof in the indoor sports room is leaking during rain. Water is collecting on the badminton court floor, making it slippery.',
                category: 'Facilities',
                location: 'Indoor Sports Complex',
                priority: 'High',
                status: 'Open',
                comments: [],
                history: [{ action: 'Ticket Created', by: st[22]._id }]
            },
            {
                requester: st[23]._id,
                title: 'Grade correction request for Mathematics',
                description: 'There seems to be an error in my Mathematics mid-term grade. My answer sheet shows 38/50 but the portal shows 28/50.',
                category: 'Academic Services',
                location: 'Online Portal',
                priority: 'High',
                status: 'In Progress',
                assignedTo: staffUsers[8]._id,
                comments: [
                    { user: staffUsers[8]._id, content: 'We have forwarded your request to the Mathematics department for verification.' },
                    { user: st[23]._id, content: 'Please expedite this, the final grades are being compiled soon.' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[23]._id },
                    { action: 'Status changed from "Open" to "In Progress"', by: staffUsers[8]._id }
                ]
            },
            {
                requester: st[24]._id,
                title: 'Fire extinguisher expired in Block D',
                description: 'Noticed that the fire extinguisher on Block D, 4th floor corridor has expired (last inspection date was 2024). This is a safety concern.',
                category: 'Other',
                location: 'Block D, 4th Floor Corridor',
                priority: 'Urgent',
                status: 'In Progress',
                assignedTo: staffUsers[11]._id,
                comments: [
                    { user: staffUsers[11]._id, content: 'Good catch. We are scheduling replacement for all expired extinguishers campus-wide.' },
                    { user: admin._id, content: 'Safety audit has been initiated across all blocks.' }
                ],
                history: [
                    { action: 'Ticket Created', by: st[24]._id },
                    { action: 'Status changed from "Open" to "In Progress"', by: staffUsers[11]._id }
                ]
            },
        ];

        // Create tickets one by one for sequential ID generation
        for (const ticketData of ticketsData) {
            await Ticket.create(ticketData);
        }
        console.log(`🎫 Created ${ticketsData.length} tickets with comments and history`);

        // Create sample notifications
        await Notification.create([
            { recipient: st[0]._id, message: 'Ticket #CSD-000001 status updated to: In Progress', read: false },
            { recipient: st[1]._id, message: 'New comment on your ticket about projector in Lecture Hall 3', read: false },
            { recipient: st[2]._id, message: 'Ticket #CSD-000006 has been resolved', read: true },
            { recipient: st[0]._id, message: 'Your transcript request has been processed', read: true },
            { recipient: st[6]._id, message: 'Ticket #CSD-000011 status updated to: Resolved', read: false },
            { recipient: st[11]._id, message: 'Your canteen complaint is being investigated', read: false },
            { recipient: st[17]._id, message: 'Elevator maintenance has been scheduled', read: false },
            { recipient: st[24]._id, message: 'Fire safety audit initiated based on your report', read: true },
        ]);
        console.log('🔔 Created sample notifications');

        console.log('\n✅ Seed data created successfully!');
        console.log('\n📋 Login Credentials (all use password: password123):');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  ADMIN:   rohan@campus.edu');
        console.log('  STAFF:   priya@campus.edu, vikram@campus.edu, anita@campus.edu ...(15 total)');
        console.log('  STUDENT: amit@campus.edu, sneha@campus.edu, raj@campus.edu ...(25 total)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
