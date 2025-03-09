const logger = require('../utils/logger');

/**
 * HTTP 請求日誌中間件
 * 記錄所有 HTTP 請求的詳細信息
 * 
 * @param {Object} req - Express 請求對象
 * @param {Object} res - Express 響應對象
 * @param {Function} next - Express 下一個中間件函數
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // 記錄請求開始
  logger.debug(`開始處理請求: ${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // 當響應結束時記錄完整信息
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger.http(req, res, duration);
    
    if (logLevel === 'warn') {
      logger[logLevel](`請求完成: ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration,
        requestBody: req.body
      });
    }
  });
  
  next();
};

/**
 * 註冊日誌中間件
 * @param {express.Application} app - Express 應用實例
 */
const registerLoggerMiddleware = (app) => {
  app.use(requestLogger);
};

module.exports = {
  requestLogger,
  registerLoggerMiddleware
}; 