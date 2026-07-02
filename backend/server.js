'use strict';
require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { requestLogger } = require('./middleware/loggerMiddleware');
const logger = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const riskRoutes = require('./routes/riskRoutes');
const controlRoutes = require('./routes/controlRoutes');
const auditRoutes = require('./routes/auditRoutes');
const privacyRoutes = require('./routes/privacyRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const policyRoutes = require('./routes/policyRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logger
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(requestLogger);

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/risks', riskRoutes);
app.use('/api/controls', controlRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/policies', policyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SecureComply API is running', timestamp: new Date().toISOString() });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 SecureComply server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
