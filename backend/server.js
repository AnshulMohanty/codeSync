// Load environment variables first
require('dotenv').config();

// Only set fallback values in development
if (process.env.NODE_ENV !== 'production') {
  if (!process.env.MONGODB_URI) {
    process.env.MONGODB_URI = 'mongodb+srv://Anshul_User_1:Anshul_MongoDB@cluster0.1balow3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  }
  if (!process.env.PORT) {
    process.env.PORT = '5000';
  }
  if (!process.env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = 'AIzaSyDPuFtcwuut3ZqC9ZL3YQ7Lx2Lhm4Lvnqo';
  }
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }
  if (!process.env.CORS_ORIGIN) {
    process.env.CORS_ORIGIN = 'http://localhost:5173';
  }
}

const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const projectRoutes = require('./routes/projects');
const aiRoutes = require('./routes/ai');

// Import socket handlers
const setupSocketHandlers = require('./socket/socket-handlers');

const app = express();
const server = createServer(app);

// Socket.io setup (only for development)
let io;
if (process.env.NODE_ENV !== 'production') {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174"],
      methods: ["GET", "POST"]
    }
  });
}

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'CodeSync AI Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Setup socket handlers (only for development)
if (io) {
  setupSocketHandlers(io);
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready for connections`);
});
