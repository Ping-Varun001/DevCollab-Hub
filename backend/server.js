import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import applicationRoutes from './routes/applications.js';
import chatRoutes from './routes/chat.js';
import userRoutes from './routes/users.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('DevCollab API is running successfully!');
});

// Socket.io for Real-time Chat
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinProject', (projectId) => {
        socket.join(projectId);
        console.log(`User joined project chat: ${projectId}`);
    });

    socket.on('sendMessage', (data) => {
        // data should contain projectId, sender, text, timestamp
        io.to(data.projectId).emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
