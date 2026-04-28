const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const httpServer = http.createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Make io accessible across the app
app.set('io', io);

io.on('connection', (socket) => {
    // Each user joins their own room by userId
    socket.on('join', (userId) => {
        if (userId) {
            socket.join(`user:${userId}`);
        }
    });

    socket.on('disconnect', () => {});
});

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const faqRoutes = require('./routes/faqRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/faqs', faqRoutes);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));
