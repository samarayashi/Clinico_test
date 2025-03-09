const policyholderService = require('../services/policyholder.service');
const logger = require('../utils/logger');
const { NotFoundError, DatabaseError } = require('../utils/errors');

/**
 * 查詢特定保戶及其下四階的介紹關係
 * 
 * @param {Object} req - Express請求對象
 * @param {Object} res - Express響應對象
 * @param {Function} next - Express下一個中間件函數
 */
const getPolicyholder = async (req, res, next) => {
  try {
    const { code } = req.query;
    logger.debug(`控制器: 開始查詢保戶 ${code} 及其下四階的介紹關係`);
    
    const result = await policyholderService.getPolicyholderTree(code);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`控制器: 查詢保戶 ${req.query.code} 時發生錯誤`, { error });
    return next(error);
  }
};

/**
 * 查詢特定保戶的上層關係
 * 
 * @param {Object} req - Express請求對象
 * @param {Object} res - Express響應對象
 * @param {Function} next - Express下一個中間件函數
 */
const getPolicyholderTop = async (req, res, next) => {
  try {
    const { code } = req.params; 
    logger.debug(`控制器: 開始查詢保戶 ${code} 的上層關係`);
    
    const result = await policyholderService.getPolicyholderTopTree(code);
    
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`控制器: 查詢保戶 ${req.params.code} 的上層關係時發生錯誤`, { error });
    return next(error);
  }
};

module.exports = {
  getPolicyholder,
  getPolicyholderTop
}; 