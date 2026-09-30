const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

const path = require('path');

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', require('./routes/auth'));

// Root API info fallback (if not requesting HTML)
app.get('/api', (req, res) => {
  res.json({
    message: 'Smart Faculty Leave Management System API is running',
    version: '1.0.0',
    documentation: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Smart Faculty Leave Management Backend Server`);
  console.log(` Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(` Endpoint: http://localhost:${PORT}`);
  console.log(`====================================================`);
});
