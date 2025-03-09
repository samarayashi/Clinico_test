/**
 * 自定義錯誤類別
 * 提供更具體的錯誤類型和統一的錯誤處理方式
 */

/**
 * 應用程式基礎錯誤類別
 * 所有自定義錯誤都繼承自此類別
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 資源未找到錯誤
 * 用於表示請求的資源不存在
 */
class NotFoundError extends AppError {
  constructor(message = '資源不存在', errorCode = 'RESOURCE_NOT_FOUND') {
    super(message, 404, errorCode);
  }
}

/**
 * 驗證錯誤
 * 用於表示輸入驗證失敗
 */
class ValidationError extends AppError {
  constructor(message = '驗證失敗', errors = [], errorCode = 'VALIDATION_FAILED') {
    super(message, 400, errorCode);
    this.errors = errors;
  }
}

/**
 * 資料庫錯誤
 * 用於表示資料庫操作失敗
 */
class DatabaseError extends AppError {
  constructor(message = '資料庫操作失敗', originalError = null, errorCode = 'DATABASE_ERROR') {
    super(message, 500, errorCode);
    this.originalError = originalError;
  }
}

/**
 * 業務邏輯錯誤
 * 用於表示業務邏輯驗證失敗
 */
class BusinessError extends AppError {
  constructor(message = '業務邏輯錯誤', errorCode = 'BUSINESS_RULE_VIOLATION', statusCode = 400) {
    super(message, statusCode, errorCode);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  DatabaseError,
  BusinessError
}; 