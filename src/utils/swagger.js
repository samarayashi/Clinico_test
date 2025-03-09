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
    logger.debug(`加載 YAML 文件: ${filePath}`);
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
    logger.info(`開始加載 Swagger 規範: ${mainSwaggerPath}`);
    let swaggerSpec = loadYamlFile(mainSwaggerPath);
    
    // 檢查是否有 paths 屬性
    if (!swaggerSpec.paths) {
      logger.error('Swagger 規範缺少 paths 屬性');
      swaggerSpec.paths = {};
    }
    
    // 處理 paths 引用
    if (swaggerSpec.paths && typeof swaggerSpec.paths.$ref === 'string') {
      const pathsRef = swaggerSpec.paths.$ref;
      // 刪除 $ref 屬性，避免在生成的 JSON 中保留
      const tempPaths = { ...swaggerSpec.paths };
      delete tempPaths.$ref;
      
      const pathsPath = resolveRefPath(mainSwaggerPath, pathsRef);
      logger.debug(`解析 paths 引用: ${pathsRef} -> ${pathsPath}`);
      const pathsObj = loadYamlFile(pathsPath);
      
      // 完全替換 paths 物件
      swaggerSpec.paths = pathsObj;
      
      logger.debug(`成功從 ${pathsPath} 加載路徑定義`);
    } else {
      // 處理個別路徑的引用
      Object.keys(swaggerSpec.paths).forEach(pathKey => {
        const pathItem = swaggerSpec.paths[pathKey];
        const pathRef = pathItem && pathItem.$ref;
        if (pathRef) {
          // 移除 $ref 並加載引用的文件
          delete swaggerSpec.paths[pathKey].$ref;
          const refPath = resolveRefPath(mainSwaggerPath, pathRef);
          logger.debug(`解析路徑引用: ${pathKey} -> ${refPath}`);
          swaggerSpec.paths[pathKey] = loadYamlFile(refPath);
        }
      });
    }
    
    // 處理 components 引用
    if (swaggerSpec.components && swaggerSpec.components.$ref) {
      const componentsRef = swaggerSpec.components.$ref;
      delete swaggerSpec.components.$ref;
      
      const componentsPath = resolveRefPath(mainSwaggerPath, componentsRef);
      logger.debug(`解析 components 引用: ${componentsRef} -> ${componentsPath}`);
      const componentsObj = loadYamlFile(componentsPath);
      
      swaggerSpec.components = componentsObj;
      
      // 處理 schemas 引用
      if (swaggerSpec.components.schemas && swaggerSpec.components.schemas.$ref) {
        const schemasRef = swaggerSpec.components.schemas.$ref;
        delete swaggerSpec.components.schemas.$ref;
        
        const schemasPath = resolveRefPath(componentsPath, schemasRef);
        logger.debug(`解析 schemas 引用: ${schemasRef} -> ${schemasPath}`);
        swaggerSpec.components.schemas = loadYamlFile(schemasPath);
      }
      
      // 處理 responses 引用
      if (swaggerSpec.components.responses && swaggerSpec.components.responses.$ref) {
        const responsesRef = swaggerSpec.components.responses.$ref;
        delete swaggerSpec.components.responses.$ref;
        
        const responsesPath = resolveRefPath(componentsPath, responsesRef);
        logger.debug(`解析 responses 引用: ${responsesRef} -> ${responsesPath}`);
        swaggerSpec.components.responses = loadYamlFile(responsesPath);
      }
    }
    
    // 將 swagger.json 保存到文件系統以便調試
    try {
      const debugPath = path.join(__dirname, '../debug-swagger.json');
      fs.writeFileSync(debugPath, JSON.stringify(swaggerSpec, null, 2));
      logger.debug(`Swagger 規範已保存至 ${debugPath}`);
    } catch (e) {
      logger.warn('無法保存調試用的 Swagger 規範', { error: e.message });
    }
    
    // 輸出 Swagger 規範以便檢查
    logger.debug('Swagger 規範加載完成', { 
      hasComponents: !!swaggerSpec.components,
      hasSchemas: swaggerSpec.components && !!swaggerSpec.components.schemas,
      hasResponses: swaggerSpec.components && !!swaggerSpec.components.responses,
      pathsCount: Object.keys(swaggerSpec.paths).length,
      paths: Object.keys(swaggerSpec.paths)
    });
    
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