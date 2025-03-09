/**
 * 通用驗證規則
 */
const { validationResult } = require('express-validator');

/**
 * 驗證結果處理中間件
 * 檢查請求中是否有驗證錯誤，如果有則返回 400 錯誤
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  // 格式化錯誤訊息
  const errorMessages = errors.array().map(err => ({
    field: err.path,
    message: err.msg
  }));
  
  return res.status(400).json({
    success: false,
    message: '參數驗證失敗',
    errors: errorMessages
  });
};

/**
 * 常用的正則表達式模式
 */
const patterns = {
  // 保戶編號格式：P 開頭加 3 位數字
  policyholderCode: /^P\d{3}$/,
  
  // 電子郵件格式
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // 台灣手機號碼格式：09 開頭加 8 位數字
  mobilePhone: /^09\d{8}$/
};

module.exports = {
  validate,
  patterns
}; 