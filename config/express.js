const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('../src/routes');

/**
 * 配置 Express 應用
 * @param {express.Application} app - Express 應用實例
 */
module.exports = (app) => {
  // 安全性中間件
  app.use(helmet());
  
  // 跨域支援
  app.use(cors());
  
  // 請求解析中間件
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // 日誌中間件
  app.use(morgan('dev'));
  
  // 路由設定
  app.use(routes);
  
  return app;
}; 