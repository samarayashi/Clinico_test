const { AppError, NotFoundError, ValidationError, DatabaseError, BusinessError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * 處理 404 錯誤的中間件
 * @param {Object} req - Express 請求對象
 * @param {Object} res - Express 響應對象
 * @param {Function} next - Express 下一個中間件函數
 */
const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`找不到請求的資源: ${req.originalUrl}`));
};

/**
 * 處理錯誤的中間件
 * @param {Error} err - 錯誤對象
 * @param {Object} req - Express 請求對象
 * @param {Object} res - Express 響應對象
 * @param {Function} next - Express 下一個中間件函數
 */
const errorHandler = (err, req, res, next) => {
  // 記錄錯誤
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`[${err.name}] ${err.message}`, { 
        errorCode: err.errorCode,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        body: req.body
      });
    } else {
      logger.warn(`[${err.name}] ${err.message}`, { 
        errorCode: err.errorCode,
        url: req.originalUrl,
        method: req.method
      });
    }
  } else {
    logger.error(`[UnhandledError] ${err.message || '未知錯誤'}`, { 
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.body
    });
  }

  // 處理 express-validator 的錯誤
  if (err.array && typeof err.array === 'function') {
    return res.status(400).json({
      success: false,
      message: '輸入驗證失敗',
      errors: err.array()
    });
  }

  // 處理自定義錯誤
  if (err instanceof AppError) {
    const response = {
      success: false,
      message: err.message,
      errorCode: err.errorCode
    };

    // 如果是驗證錯誤，添加詳細的錯誤信息
    if (err instanceof ValidationError && err.errors) {
      response.errors = err.errors;
    }

    return res.status(err.statusCode).json(response);
  }

  // 處理 Sequelize 錯誤
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: '資料驗證失敗',
      errors: err.errors.map(e => ({ message: e.message, field: e.path }))
    });
  }

  // 處理其他未知錯誤
  res.status(500).json({
    success: false,
    message: '伺服器內部錯誤',
    errorCode: 'INTERNAL_SERVER_ERROR'
  });
};

/**
 * 設定全局未捕獲異常處理
 */
const setupUncaughtExceptionHandlers = () => {
  process.on('uncaughtException', (error) => {
    logger.error('未捕獲的異常', { error });
    // 在生產環境中，可能需要通知管理員或重啟服務
    if (process.env.NODE_ENV === 'production') {
      process.exit(1); // 在生產環境中，未捕獲的異常可能導致應用狀態不一致，最好重啟
    }
  });

  process.on('unhandledRejection', (error) => {
    logger.error('未處理的Promise拒絕', { error });
    // 在生產環境中，可能需要通知管理員
  });
};

/**
 * 註冊所有錯誤處理中間件
 * @param {express.Application} app - Express 應用實例
 */
const registerErrorHandlers = (app) => {
  // 404 處理必須在所有路由之後
  app.use(notFoundHandler);
  
  // 錯誤處理中間件必須在最後
  app.use(errorHandler);
  
  // 設定全局未捕獲異常處理
  setupUncaughtExceptionHandlers();
};

module.exports = {
  notFoundHandler,
  errorHandler,
  setupUncaughtExceptionHandlers,
  registerErrorHandlers
}; 