// Load environment variables first
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'GEMINI_API_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  console.error('Please check your .env file or environment configuration.');
  process.exit(1);
}

// Set default values for development only
if (process.env.NODE_ENV !== 'production') {
  if (!process.env.PORT) {
    process.env.PORT = '5000';
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

// Socket.io setup
let io;
const corsOrigins = process.env.NODE_ENV === 'production' 
  ? [
      process.env.CORS_ORIGIN,
      'https://code-sync-ten-blue.vercel.app',
      'https://code-sync-eyqecmuw9-anshuls-projects-fa3416c0.vercel.app',
      'https://code-sync.vercel.app',
      /\.vercel\.app$/
    ]
  : ["http://localhost:5173", "http://localhost:5174"];

io = new Server(server, {
  cors: {
    origin: corsOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Connect to database
connectDB();

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (process.env.NODE_ENV === 'production') {
      // Allow all Vercel domains
      if (origin.match(/\.vercel\.app$/)) {
        return callback(null, true);
      }
      
      // Allow specific domains
      const allowedOrigins = [
        process.env.CORS_ORIGIN,
        'https://code-sync-ten-blue.vercel.app',
        'https://code-sync-eyqecmuw9-anshuls-projects-fa3416c0.vercel.app',
        'https://code-sync.vercel.app'
      ];
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      return callback(new Error('Not allowed by CORS'));
    } else {
      // Development - allow localhost
      const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

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

// Setup socket handlers
setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready for connections`);
});
