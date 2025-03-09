const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * 解析引用路徑
 * @param {string} basePath - 基礎路徑
 * @param {string} refPath - 引用路徑
 * @returns {string} 完整路徑
 */
const resolveRefPath = (basePath, refPath) => {
  // 如果是相對路徑，則相對於基礎路徑
  if (refPath.startsWith('./') || refPath.startsWith('../')) {
    return path.resolve(path.dirname(basePath), refPath);
  }
  // 否則相對於 swagger 目錄
  return path.join(__dirname, '../swagger', refPath);
};

/**
 * 加載 YAML 文件
 * @param {string} filePath - 文件路徑
 * @returns {Object} 解析後的 YAML 對象
 */
const loadYamlFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return yaml.load(content);
  } catch (error) {
    logger.error(`加載 YAML 文件失敗: ${filePath}`, { error });
    throw error;
  }
};

/**
 * 加載 Swagger YAML 文件
 * @returns {Object} Swagger 規範對象
 */
const loadSwaggerSpec = () => {
  try {
    // 讀取主要的 Swagger YAML 文件
    const mainSwaggerPath = path.join(__dirname, '../swagger/swagger.yaml');
    const swaggerSpec = loadYamlFile(mainSwaggerPath);
    
    // 處理 paths 引用
    Object.keys(swaggerSpec.paths).forEach(pathKey => {
      const pathRef = swaggerSpec.paths[pathKey].$ref;
      if (pathRef) {
        // 移除 $ref 並加載引用的文件
        delete swaggerSpec.paths[pathKey].$ref;
        const refPath = resolveRefPath(mainSwaggerPath, pathRef);
        swaggerSpec.paths[pathKey] = loadYamlFile(refPath);
      }
    });
    
    // 處理 components 引用
    if (swaggerSpec.components && swaggerSpec.components.$ref) {
      const componentsRef = swaggerSpec.components.$ref;
      delete swaggerSpec.components.$ref;
      
      const componentsPath = resolveRefPath(mainSwaggerPath, componentsRef);
      const componentsObj = loadYamlFile(componentsPath);
      
      swaggerSpec.components = componentsObj;
      
      // 處理 schemas 引用
      if (swaggerSpec.components.schemas && swaggerSpec.components.schemas.$ref) {
        const schemasRef = swaggerSpec.components.schemas.$ref;
        delete swaggerSpec.components.schemas.$ref;
        
        const schemasPath = resolveRefPath(componentsPath, schemasRef);
        swaggerSpec.components.schemas = loadYamlFile(schemasPath);
      }
      
      // 處理 responses 引用
      if (swaggerSpec.components.responses && swaggerSpec.components.responses.$ref) {
        const responsesRef = swaggerSpec.components.responses.$ref;
        delete swaggerSpec.components.responses.$ref;
        
        const responsesPath = resolveRefPath(componentsPath, responsesRef);
        swaggerSpec.components.responses = loadYamlFile(responsesPath);
      }
    }
    
    return swaggerSpec;
  } catch (error) {
    logger.error('加載 Swagger 規範失敗', { error });
    throw error;
  }
};

/**
 * 設定 Swagger 文檔
 * @param {express.Application} app - Express 應用實例
 */
const setupSwagger = (app) => {
  try {
    // 加載 Swagger 規範
    const swaggerSpec = loadSwaggerSpec();
    
    // 設定 Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: '保戶介紹關係系統 API 文檔'
    }));
    
    // 提供 swagger.json 端點
    app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
    
    logger.info('Swagger 文檔已設定，可訪問 /api-docs 查看');
  } catch (error) {
    logger.error('設定 Swagger 文檔失敗', { error });
    // 不要讓 Swagger 錯誤影響應用程式啟動
    console.error('設定 Swagger 文檔失敗:', error);
  }
};

module.exports = {
  setupSwagger
}; 