const { Sequelize } = require('sequelize');
const dbConfig = require('../../../config/db.config');

/**
 * 創建 Sequelize 實例
 * @param {string} environment - 環境名稱 (development, production)
 * @returns {Sequelize} Sequelize 實例
 */
const createSequelizeInstance = (environment = 'development') => {
  const config = dbConfig[environment];
  
  return new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      operatorsAliases: 0,
      logging: config.logging,
      pool: config.pool
    }
  );
};

/**
 * 初始化資料庫連接
 * @param {Sequelize} sequelize - Sequelize 實例
 * @returns {Promise<void>}
 */
const initializeDatabase = async (sequelize) => {
  try {
    await sequelize.authenticate();
    console.log('資料庫連接已初始化');
  } catch (error) {
    console.error('無法連接到資料庫:', error);
    throw error;
  }
};

module.exports = {
  createSequelizeInstance,
  initializeDatabase
}; 