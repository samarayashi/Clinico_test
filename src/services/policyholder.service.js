const db = require('../models');
const { QueryTypes } = require('sequelize');
const Policyholder = db.policyholders;
const _ = require('lodash');
const { NotFoundError, DatabaseError } = require('../utils/errors');
const logger = require('../utils/logger');

const getRelatedHolderInfo = async (code, tx) => {
  const startTime = Date.now();
  try {
    logger.debug(`開始獲取保戶 ${code} 的相關資訊`);
    
    const result = await db.sequelize.query(`
WITH RECURSIVE top_tree AS (
    -- 基本查詢: 找出起始保戶
    SELECT 
        code, 
        name, 
        registration_date, 
        introducer_code,
        0 AS level,
        'main' as relationship
    FROM 
        policyholders
    WHERE 
        code = :code
        
    UNION ALL
    
    -- 遞迴查詢: 找出所有直接關係人和間接關係人
    SELECT 
        p.code, 
        p.name, 
        p.registration_date, 
        p.introducer_code,
        t.level + 1 AS level,
        CASE WHEN t.level + 1 = 1 THEN 'direct' ELSE 'indirect' END AS relationship
    FROM 
        policyholders p
    JOIN 
        top_tree t ON p.introducer_code = t.code  -- 修改這裡
    WHERE 
        t.level < 31  -- 限制最多查詢30階
)
SELECT 
    code, 
    name, 
    registration_date,
    introducer_code,
    level,
    relationship
FROM 
    top_tree
ORDER BY 
    CASE WHEN level = 0 THEN 0 ELSE 1 END,  -- level = 0 的保戶優先
    registration_date -- 其他保戶根據 registration_date 排序
LIMIT 31; 
  `, {
      replacements: { code },
      type: QueryTypes.SELECT,
      transaction: tx
    });

    const duration = Date.now() - startTime;
    logger.db('query', 'policyholders', duration);
    logger.debug(`成功獲取保戶 ${code} 的相關資訊，共 ${result.length} 筆資料`);
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.db('query', 'policyholders', duration, error);
    logger.error(`獲取保戶 ${code} 資料時發生錯誤`, { error });
    throw new DatabaseError('獲取保戶資料時發生錯誤', error);
  }
};


// 每次產生介紹新保戶時，會產生在人數最少的節點下，當左右 2 邊人數相同時，會以左邊為優先
const parseHolderToTree = (holders) => {
   // 主節點
   const mainHolder = _.remove(holders, holder => holder.relationship === 'main')[0];
   
   // 產生樹的基本結構
   const treeData = {
     code: mainHolder.code,
     name: mainHolder.name,
     registration_date: mainHolder.registration_date,
     introducer_code: mainHolder.introducer_code,
     l: [], // 左樹
     r: []  // 右樹
   };


  // 3. 依照 index 來決定左右
  // 建立四層架構的迴圈
  let idx = 0;
  for (let i = 0; i < 4; i++) {
    let chunk_size = 2 ** i;
    let lchunk = holders.slice(idx, idx + chunk_size);
    idx += chunk_size;
    let rchunk = holders.slice(idx, idx + chunk_size);
    idx += chunk_size;
    treeData.l.push(lchunk);
    treeData.r.push(rchunk);
    if (rchunk.length < chunk_size || lchunk.length < chunk_size) {
      break;
    }
  }
  return treeData;
};


/**
 * 取得保戶及其四階層介紹關係
 * 
 * @param {string} code - 保戶編號
 * @returns {Object} 保戶及其下四階的介紹關係樹
 */
const getPolicyholderTree = async (code) => {
  logger.info(`開始獲取保戶 ${code} 的樹狀結構`);
  
  try {
    // 1. 先查詢該保戶是否存在
    const holders = await getRelatedHolderInfo(code);
    if (holders.length === 0) {
      logger.warn(`保戶 ${code} 不存在`);
      throw new NotFoundError(`保戶 ${code} 不存在`);
    }
   
    // 2. 產生樹狀結構
    logger.debug(`開始為保戶 ${code} 產生樹狀結構`);
    const treeData = parseHolderToTree(holders);
    logger.info(`成功獲取保戶 ${code} 的樹狀結構`);

    return treeData;
    
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error(`獲取保戶 ${code} 的樹狀結構時發生錯誤`, { error });
    throw new DatabaseError('獲取保戶資料時發生錯誤', error);
  }
};

/**
 * 取得其直接介紹人的資料
 * 
 * @param {string} code - 保戶編號
 * @returns {Object} 
 */
const getPolicyholderTopTree = async (code) => {
  logger.info(`開始獲取保戶 ${code} 的上層介紹人樹狀結構`);
  
  try {
    // 1. 先查詢該保戶是否存在
    const policyholder = await Policyholder.findByPk(code);
    if (!policyholder) {
      logger.warn(`保戶 ${code} 不存在`);
      throw new NotFoundError(`保戶 ${code} 不存在`);
    }
    
    // 2. 查詢其直接介紹人的資料
    logger.debug(`查詢保戶 ${code} 的直接介紹人 ${policyholder.introducer_code}`);
    const introducer = await Policyholder.findByPk(policyholder.introducer_code);
    if (!introducer) {
      logger.warn(`保戶 ${code} 的直接介紹人 ${policyholder.introducer_code} 不存在`);
      throw new NotFoundError(`保戶 ${code} 的直接介紹人不存在`);
    }
    
    // 3. 產生樹狀結構
    logger.debug(`開始為介紹人 ${introducer.code} 產生樹狀結構`);
    const holders = await getRelatedHolderInfo(introducer.code);
    const treeData = parseHolderToTree(holders);
    logger.info(`成功獲取保戶 ${code} 的上層介紹人樹狀結構`);

    return treeData;
    
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    logger.error(`獲取保戶 ${code} 的上層介紹人樹狀結構時發生錯誤`, { error });
    throw new DatabaseError('獲取保戶資料時發生錯誤', error);
  }
};

module.exports = {
  getPolicyholderTree,
  getPolicyholderTopTree
}; 