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

## 部署資訊

專案已部署於：[https://policyholders-api-amd64.onrender.com/api-docs](https://policyholders-api-amd64.onrender.com/api-docs)

### 部署架構

- **容器化**：使用Docker Hub的映像檔
- **資料庫**：使用Render.io提供的PostgreSQL資料庫服務
- **持續部署**：已設置Webhook，當標記為`amd64`的映像檔被推送至Docker Hub時，會自動觸發部署流程

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

### 其他考慮的表格設計方案

#### Closure Table（閉包表模型）

這種方式使用一張額外的表來存儲所有節點與祖先的關係，不再需要遞迴的通用表達式（RCTE）。

```sql
CREATE TABLE policyholders (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    registration_date TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE policyholder_closure (
    ancestor VARCHAR(10) NOT NULL,
    descendant VARCHAR(10) NOT NULL,
    depth INT NOT NULL,
    PRIMARY KEY (ancestor, descendant),
    FOREIGN KEY (ancestor) REFERENCES policyholders(code),
    FOREIGN KEY (descendant) REFERENCES policyholders(code)
);
```

**優勢**：
- 查詢所有後代或祖先非常快速，因為它是一張獨立的關聯表
- 支持高效的樹結構遍歷和查詢

**劣勢**：
- 插入時需要額外插入多條記錄（例如新增一個保戶時，需要插入與所有祖先的關聯）
- 儲存較為冗長，需要額外的空間來存儲關係
- 維護成本較高，尤其是當節點移動或結構變化時

## 技術選型

- **後端**: Node.js, Express.js
- **資料庫**: PostgreSQL
- **ORM**: Sequelize
- **容器化**: Docker, Docker Compose
- **安全性**: Helmet
- **日誌**: Morgan, winston
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
│   ├── swagger/            # Swagger 規範
│   ├── utils/              # 工具函數
│   |      ├── bootstrap/   # 啟動預載
│   |      ├── logger.js    # 日誌
│   |      ├── swagger.js   # Swagger 配置
│   └── validations/        # 參數驗證
├── .env                    # 環境變數
├── .env.example            # 環境變數範例
├── docker-compose.yml      # Docker 配置
├── Dockerfile              # Docker 配置
├── package.json            # 專案配置
├── README.md               # 專案說明
└── server.js               # 應用入口
``` 