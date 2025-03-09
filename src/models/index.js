/**
 * 資料庫模型索引檔案
 * 
 * 這個檔案負責初始化 Sequelize 實例並載入所有模型。
 */

const { createSequelizeInstance } = require('../utils/bootstrap/database');
const env = process.env.NODE_ENV || 'development';

// 創建 Sequelize 實例
const sequelize = createSequelizeInstance(env);

// 初始化資料庫對象
const db = {};
db.Sequelize = require('sequelize').Sequelize;
db.sequelize = sequelize;

// 載入模型
db.policyholders = require('./policyholder.model')(sequelize, db.Sequelize);

// 設定模型關聯
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db; 