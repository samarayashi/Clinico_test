# 保戶介紹關係系統 API

這是一個用於管理保戶介紹關係的API系統，採用Express.js和PostgreSQL實現。

## 功能特點

- 保戶資料儲存與查詢
- 實現以保戶為中心的「組織圖」呈現
- 可查詢特定保戶及其下4階的介紹關係
- 可查詢特定保戶的上層介紹關係
- 參數驗證與錯誤處理

## 系統需求

- Node.js v14+
- PostgreSQL v12+
- Docker & Docker Compose (可選，用於環境隔離)

## 快速開始

### 安裝依賴

```bash
npm install
```

### 設定環境變數

複製`.env.example`文件到`.env`並根據需要修改設定：

```bash
cp .env.example .env
```

### 使用Docker啟動PostgreSQL資料庫

```bash
npm run docker:up
```

### 啟動應用程序

開發環境：
```bash
npm run dev
```

生產環境：
```bash
npm start
```

## API文件

### 保戶查詢

- **Endpoint**: `/api/policyholders`
- **Method**: GET
- **Query Parameters**: 
  - `code` (必填): 保戶編號，格式為 P 開頭加 3 位數字 (例如: P001)
- **Response**: 返回保戶及其下四階的介紹關係樹
- **錯誤處理**:
  - 400: 參數驗證失敗
  - 404: 保戶不存在
  - 500: 伺服器內部錯誤

### 保戶上層查詢

- **Endpoint**: `/api/policyholders/{code}/top`
- **Method**: GET
- **Path Parameters**: 
  - `code` (必填): 保戶編號，格式為 P 開頭加 3 位數字 (例如: P001)
- **Response**: 返回保戶上層的介紹關係樹
- **錯誤處理**:
  - 400: 參數驗證失敗
  - 404: 保戶不存在
  - 500: 伺服器內部錯誤

## 資料庫設計

系統採用鄰接表模型(Adjacency List)來表示保戶的介紹關係：

```sql
CREATE TABLE policyholders (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT NOW(),
    introducer_code VARCHAR(10) NULL,
    FOREIGN KEY (introducer_code) REFERENCES policyholders(code)
);
```

## 技術選型

- **後端**: Node.js, Express.js
- **資料庫**: PostgreSQL
- **ORM**: Sequelize
- **容器化**: Docker, Docker Compose
- **安全性**: Helmet
- **日誌**: Morgan
- **參數驗證**: express-validator

## 專案結構

```
.
├── config/                 # 配置文件
│   ├── db.config.js        # 資料庫配置
│   └── express.js          # Express 配置
├── db/                     # 資料庫相關
│   └── init/               # 初始化腳本
│       ├── 01_ddl.sql      # 資料表定義
│       └── 02_dml.sql      # 測試資料
├── src/                    # 源代碼
│   ├── controllers/        # 控制器
│   ├── middlewares/        # 中間件
│   ├── models/             # 資料模型
│   ├── routes/             # 路由定義
│   ├── services/           # 業務邏輯
│   ├── utils/              # 工具函數
│   └── validations/        # 參數驗證
├── .env                    # 環境變數
├── .env.example            # 環境變數範例
├── docker-compose.yml      # Docker 配置
├── package.json            # 專案配置
├── README.md               # 專案說明
└── server.js               # 應用入口
``` 