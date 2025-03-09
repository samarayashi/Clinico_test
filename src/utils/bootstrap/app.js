const express = require('express');
const configureExpress = require('../../../config/express');
const { registerErrorHandlers } = require('../../middlewares/error.middleware');
const { registerLoggerMiddleware } = require('../../middlewares/logger.middleware');
const logger = require('../logger');
const { setupSwagger } = require('../swagger');

/**
 * 創建並配置 Express 應用
 * @returns {express.Application} 配置好的 Express 應用實例
 */
const createApp = () => {
  // 創建 Express 應用實例
  const app = express();
  
  // 註冊日誌中間件 (必須在其他中間件之前)
  registerLoggerMiddleware(app);
  
  // 配置 Express 中間件和路由
  configureExpress(app);
  
  // 設定 Swagger 文檔
  setupSwagger(app);
  
  // 註冊錯誤處理中間件
  registerErrorHandlers(app);
  
  logger.info('應用程式已成功初始化');
  
  return app;
};

module.exports = {
  createApp
}; 