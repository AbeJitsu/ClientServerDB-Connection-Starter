const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/database-status', async (req, res) => {
  try {
    const status = mongoose.connection.readyState;
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    res.json({
      status: statusMap[status],
      dbName: mongoose.connection.name,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Database status check failed', details: error.message });
  }
});

module.exports = router;
