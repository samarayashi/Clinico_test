const express = require('express');
const router = express.Router();
const policyholderController = require('../controllers/policyholder.controller');
const { 
  validateGetPolicyholder, 
  validateGetPolicyholderTop 
} = require('../validations/policyholder.validation');

// GET /api/policyholders - 搜尋保戶
router.get('/', 
  validateGetPolicyholder,
  policyholderController.getPolicyholder
);

// GET /api/policyholders/:code/top - 查詢保戶上層關係
router.get('/:code/top', 
  validateGetPolicyholderTop,
  policyholderController.getPolicyholderTop
);

module.exports = router; 