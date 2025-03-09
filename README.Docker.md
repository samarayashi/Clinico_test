# Docker 部署指南

本文檔提供了使用 Docker 和 Docker Compose 部署保戶介紹關係系統 API 的詳細說明。

## 前提條件

- 安裝 [Docker](https://docs.docker.com/get-docker/)
- 安裝 [Docker Compose](https://docs.docker.com/compose/install/)

## 部署步驟

### 1. 環境配置

複製環境變量範例文件並根據需要進行修改：

```bash
cp .env.example .env
```

編輯 `.env` 文件，設置適合您環境的配置。

### 2. 使用 Docker Compose 啟動服務

```bash
docker-compose up -d
```

這將在後台啟動所有服務。首次運行時，Docker 會：
- 構建 API 服務映像
- 拉取 PostgreSQL 映像
- 創建並啟動所有容器
- 設置網絡和卷

### 3. 查看服務狀態

```bash
docker-compose ps
```

### 4. 查看日誌

```bash
# 查看所有服務的日誌
docker-compose logs

# 查看特定服務的日誌
docker-compose logs api
docker-compose logs postgres

# 實時查看日誌
docker-compose logs -f
```

## 停止和管理服務

### 停止服務

```bash
docker-compose down
```

### 重啟服務

```bash
docker-compose restart
```

### 重建服務

如果您對 Dockerfile 或代碼進行了更改，需要重建映像：

```bash
docker-compose build
docker-compose up -d
```

## 多階段構建說明

本項目使用 Docker 的多階段構建功能來優化映像大小和安全性：

1. **依賴階段**：安裝生產環境所需的依賴
2. **構建階段**：安裝所有依賴並準備應用程序代碼
3. **運行階段**：僅包含運行應用程序所需的文件，減小映像大小

## 數據持久化

PostgreSQL 數據存儲在 Docker 卷中，確保容器重啟後數據不會丟失。

## 安全注意事項

- 生產環境中，請確保修改所有默認密碼
- 考慮使用 Docker Secrets 或其他安全的憑證管理解決方案
- 生產環境中應限制容器的網絡訪問和資源使用 