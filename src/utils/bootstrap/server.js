const { initializeDatabase } = require('./database');

const isProduction = process.env.NODE_ENV === 'production';
const DOMAIN = isProduction ? 'https://policyholders-api-amd64.onrender.com/api' : `http://localhost:${process.env.PORT}`
/**
 * 啟動 HTTP 伺服器
 * @param {express.Application} app - Express 應用實例
 * @param {number} port - 伺服器端口
 * @returns {Promise<http.Server>} HTTP 伺服器實例
 */
const startHttpServer = (app, port) => {
  return new Promise((resolve, reject) => {
    try {
      const server = app.listen(port, () => {
        console.log(`伺服器運行於 ${DOMAIN}`);
        resolve(server);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * 連接資料庫並啟動伺服器
 * @param {express.Application} app - Express 應用實例
 * @param {Object} db - 資料庫實例
 * @param {number} port - 伺服器端口
 * @returns {Promise<http.Server>} HTTP 伺服器實例
 */
const startServer = async (app, db, port) => {
  try {
    // 初始化資料庫連接
    await initializeDatabase(db.sequelize);
    
    // 啟動 HTTP 伺服器
    return await startHttpServer(app, port);
  } catch (error) {
    console.error('啟動伺服器失敗:', error);
    throw error;
  }
};

module.exports = {
  startHttpServer,
  startServer
}; 