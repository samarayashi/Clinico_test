const express = require('express');
const router = express.Router();
const policyholderRoutes = require('./policyholder.routes');

// 添加API版本前綴
router.use('/api/policyholders', policyholderRoutes);

module.exports = router; 