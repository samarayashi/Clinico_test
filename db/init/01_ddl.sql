-- 建立保戶資料表
CREATE TABLE IF NOT EXISTS policyholders (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT NOW(),
    introducer_code VARCHAR(10) NULL,
    FOREIGN KEY (introducer_code) REFERENCES policyholders(code)
);

-- 建立索引加速查詢
CREATE INDEX IF NOT EXISTS idx_policyholders_introducer_code ON policyholders(introducer_code);
CREATE INDEX IF NOT EXISTS idx_policyholders_registration_date ON policyholders(registration_date);

-- 創建視圖方便查詢階層關係
CREATE OR REPLACE VIEW vw_policyholder_relationships AS
SELECT 
    p.code,
    p.name,
    p.registration_date,
    p.introducer_code,
    i.name as introducer_name,
    i.registration_date as introducer_registration_date
FROM 
    policyholders p
LEFT JOIN 
    policyholders i ON p.introducer_code = i.code; 