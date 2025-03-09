/**
 * 應用程式入口點
 * 
 * 這個檔案負責初始化應用程式並啟動伺服器。
 * 它將各個模組組合在一起，但不包含具體實現細節。
 */

// 載入環境變數
require('dotenv').config();
const { createApp } = require('./src/utils/bootstrap/app');
const { startServer } = require('./src/utils/bootstrap/server');

// 設定端口
const PORT = process.env.PORT || 3000;

// 引入必要的模組
const db = require('./src/models');

// 創建應用程式
const app = createApp();

// 啟動伺服器
startServer(app, db, PORT)
  .catch(error => {
    console.error('無法啟動應用程式:', error);
    process.exit(1);
  }); 