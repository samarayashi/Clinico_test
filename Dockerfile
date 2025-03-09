# 第一階段：依賴安裝
FROM node:18-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# 第二階段：運行階段
FROM node:18-alpine
WORKDIR /app
# 設置環境變量
ENV NODE_ENV=production

# 從第一階段複製依賴
COPY --from=dependencies /app/node_modules ./node_modules
# 複製應用代碼
COPY . .

# 創建非root用戶並切換
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app
USER nodejs

# 暴露端口
EXPOSE 3000

# 啟動應用
CMD ["node", "server.js"] 