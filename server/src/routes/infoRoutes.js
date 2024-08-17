// server/src/routes/infoRoutes.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const os = require('os');
const errorHandler = require('../middleware/errorHandler');

// Helper function to get system info
const getSystemInfo = () => ({
  nodeVersion: process.version,
  platform: process.platform,
  memory: {
    total: `${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`,
    free: `${Math.round(os.freemem() / (1024 * 1024 * 1024))} GB`,
  },
  uptime: `${Math.floor(process.uptime())} seconds`,
});

// Helper function to get database info
const getDatabaseInfo = () => ({
  connected: mongoose.connection.readyState === 1,
  uri: process.env.MONGODB_URI
    ? 'Connected (URI masked for security)'
    : 'Not provided',
  name: mongoose.connection.name,
  host: mongoose.connection.host,
  port: mongoose.connection.port,
});

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Main info route
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const serverInfo = {
      message: 'Server is running and connected to the database',
      serverInfo: {
        port: process.env.PORT || 3000,
        ...getSystemInfo(),
      },
      databaseInfo: getDatabaseInfo(),
    };
    res.json(serverInfo);
  })
);

// Database status route
router.get(
  '/database-status',
  asyncHandler(async (req, res) => {
    const status = mongoose.connection.readyState;
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };

    res.json({
      status: statusMap[status],
      ...getDatabaseInfo(),
    });
  })
);

// Apply error handler to all routes
router.use(errorHandler);

module.exports = router;
