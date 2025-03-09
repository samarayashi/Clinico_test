const winston = require('winston');
const path = require('path');
const fs = require('fs');

// 確保日誌目錄存在
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// 定義日誌格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} ${level}: ${message} ${metaString}`;
  })
);

// 創建 Winston 日誌實例
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'policyholder-api' },
  transports: [
    // 寫入所有日誌到 combined.log
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // 寫入所有錯誤日誌到 error.log
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // 開發環境下，同時輸出到控制台
    new winston.transports.Console({
      format: logFormat
    })
  ],
  // 未捕獲的異常也會被記錄
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logDir, 'exceptions.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.Console({
      format: logFormat
    })
  ],
  // 未處理的 Promise 拒絕也會被記錄
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logDir, 'rejections.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.Console({
      format: logFormat
    })
  ],
  exitOnError: false
});

// 在生產環境中，可能不需要控制台輸出
if (process.env.NODE_ENV === 'production') {
  logger.transports.find(t => t instanceof winston.transports.Console).level = 'error';
}

// 為了方便使用，添加一些常用的日誌方法
module.exports = {
  error: (message, meta) => logger.error(message, meta),
  warn: (message, meta) => logger.warn(message, meta),
  info: (message, meta) => logger.info(message, meta),
  debug: (message, meta) => logger.debug(message, meta),
  // 記錄 HTTP 請求
  http: (req, res, responseTime) => {
    const { method, url, ip } = req;
    const statusCode = res.statusCode;
    
    logger.info(`HTTP ${method} ${url} ${statusCode} - ${responseTime}ms - ${ip}`);
  },
  // 記錄資料庫操作
  db: (operation, model, duration, error) => {
    if (error) {
      logger.error(`DB ${operation} ${model} failed after ${duration}ms`, { error });
    } else {
      logger.debug(`DB ${operation} ${model} completed in ${duration}ms`);
    }
  },
  // 原始 logger 實例，以便進行更高級的操作
  logger
}; 