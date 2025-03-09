/**
 * 保戶相關的驗證規則
 */
const { query, param } = require('express-validator');
const { validate, patterns } = require('./common.validation');

/**
 * 保戶查詢驗證規則
 * 驗證 GET /api/policyholders 的查詢參數
 */
const validateGetPolicyholder = [
  query('code')
    .exists().withMessage('缺少必要參數: code')
    .notEmpty().withMessage('保戶編號不能為空')
    .isString().withMessage('保戶編號必須是字串')
    .matches(patterns.policyholderCode).withMessage('保戶編號格式不正確，應為 P 開頭加 3 位數字'),
  validate
];

/**
 * 保戶上層查詢驗證規則
 * 驗證 GET /api/policyholders/:code/top 的路徑參數
 */
const validateGetPolicyholderTop = [
  param('code')
    .exists().withMessage('缺少必要參數: code')
    .notEmpty().withMessage('保戶編號不能為空')
    .isString().withMessage('保戶編號必須是字串')
    .matches(patterns.policyholderCode).withMessage('保戶編號格式不正確，應為 P 開頭加 3 位數字'),
  validate
];

module.exports = {
  validateGetPolicyholder,
  validateGetPolicyholderTop
}; 