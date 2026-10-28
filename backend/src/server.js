const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const initSeatSocket = require('./sockets/seatSocket');

// Route imports
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const theatreRoutes = require('./routes/theatreRoutes');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api', apiLimiter);

// Health check endpoint - always responds 200 OK so cloud host health checks pass
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
  res.status(200).json({
    status: 'online',
    appName: 'IMovies API',
    database: dbStatus,
    version: '1.0.0',
    time: new Date().toISOString()
  });
});

// Guard middleware: if DB is still connecting or not configured, return clear standby message
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database is connecting or not yet configured. Please ensure MONGODB_URI is set in your environment variables.',
      status: 'database_standby'
    });
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Serve static frontend in production if dist exists
const fs = require('fs');
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Error Handler
app.use(errorHandler);

// Initialize real-time seat lock socket
initSeatSocket(io);

const PORT = process.env.PORT || 5000;

// Start HTTP server immediately so cloud platforms (Render, Railway, etc.) pass port checks
server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🎬 IMovies Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`📡 Real-Time Socket.io ready on port ${PORT}`);
  console.log(`====================================================`);

  // Connect to Database asynchronously without blocking server startup or exiting with failure
  connectDB().catch(err => {
    console.warn('⚠️ Database connection warning:', err.message);
  });
});
