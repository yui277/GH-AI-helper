# 部署架构说明 / Deployment Architecture Guide

**项目名称 / Project Name**: GH Helper（小壁蜂OsmiaAI）  
**版本 / Version**: 0.3.8-beta
**在线体验 / Live Demo**: https://topogenesis.top/intro/ghhelper  
**部署类型 / Deployment Type**: 前端静态文件 + PHP 后端代理

> 发布边界 / Release boundary: 本文档描述私有工程的部署形态。公开 GitHub 仓库只保留脱敏后的文档和抽象代码骨架，不包含可直接部署的完整工程源码、知识库、数据库或密钥配置。
>
> This document describes the private engineering deployment shape. The public GitHub repository keeps only sanitized documentation and abstracted code skeletons; it does not include the full deployable source package, knowledge base, databases, or secret configuration.

---

## 📋 概览 / Overview

**中文**: 本文档描述 GH Helper（小壁蜂OsmiaAI） 系统的部署架构，包括前端部署方案、后端代理服务器配置、数据库设计和环境变量配置。所有敏感信息使用占位符，实际部署时需替换为真实值。

**English**: This document describes the deployment architecture of the GH Helper (OsmiaAI) system, including frontend deployment plan, backend proxy server configuration, database design, and environment variable configuration. All sensitive information uses placeholders that must be replaced with real values during actual deployment.

---

## 1. 系统架构总览 / System Architecture Overview

### 1.1 架构图 / Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                      客户端 / Client                      │
│  ┌────────────────────────────────────────────────────┐  │
│  │  浏览器 / Browser                                  │  │
│  │  - GH_helper_super.html                           │  │
│  │  - JavaScript 模块 / JS Modules                   │  │
│  │  - CSS 样式 / CSS Styles                          │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                          ↓ HTTP/HTTPS
┌──────────────────────────────────────────────────────────┐
│                   Web 服务器 / Web Server                  │
│  ┌─────────────────────┐    ┌──────────────────────────┐ │
│  │  静态文件服务        │    │  PHP 后端代理             │ │
│  │  Static File Server │    │  PHP Backend Proxy       │ │
│  │                     │    │                          │ │
│  │  - HTML/CSS/JS      │    │  - gha_api.php           │ │
│  │  - Knowledge Base   │    │  - api/chat.php          │ │
│  └─────────────────────┘    │  - api/common.php        │ │
│                             └──────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│                   数据存储 / Data Storage                  │
│  ┌─────────────────────┐    ┌──────────────────────────┐ │
│  │  SQLite 数据库       │    │  文件系统                 │ │
│  │  SQLite Database    │    │  File System             │ │
│  │                     │    │                          │ │
│  │  - 用户信息          │    │  - 知识库 JSON           │ │
│  │  - 对话历史          │    │  - 任务缓存              │ │
│  │  - 消息记录          │    │  - 日志文件              │ │
│  └─────────────────────┘    └──────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│                 外部服务 / External Services               │
│  ┌────────────────────────────────────────────────────┐  │
│  │  DeepSeek AI API                                   │  │
│  │  - 模型推理 / Model Inference                     │  │
│  │  - 思维链生成 / Chain-of-Thought Generation       │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 2. 前端部署方案 / Frontend Deployment Plan

### 2.1 文件结构 / File Structure

```
/var/www/gh-helper/
├── GH_helper_super.html          # 主入口文件
├── webbase.css                   # 基础样式
├── webbase.js                    # 基础交互
├── marked.min.js                 # Markdown 解析库
│
├── js/                           # JavaScript 模块
│   ├── core.js
│   ├── services.js
│   ├── agents.js
│   ├── workflows.js
│   ├── app.js
│   ├── code-panel.js
│   └── wiring-panel.js
│
├── knowledge/                    # 知识库
│   ├── index.json
│   ├── native/
│   └── plugin/
│
└── api/                          # 后端 API (PHP)
    ├── chat.php
    ├── common.php
    └── secrets.local.php
```

### 2.2 Web 服务器配置 / Web Server Configuration

#### Apache 配置示例 / Apache Configuration Example

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/gh-helper
    
    <Directory /var/www/gh-helper>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # 启用重写引擎
    RewriteEngine On
    
    # 强制 HTTPS（生产环境）
    # RewriteCond %{HTTPS} off
    # RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
    
    # 保护敏感文件
    <FilesMatch "^\.">
        Require all denied
    </FilesMatch>
    
    <Files "secrets.local.php">
        Require all denied
    </Files>
    
    # 启用压缩
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
    </IfModule>
    
    # 缓存策略
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType text/html "access plus 1 hour"
        ExpiresByType text/css "access plus 1 week"
        ExpiresByType application/javascript "access plus 1 week"
        ExpiresByType application/json "access plus 1 day"
    </IfModule>
</VirtualHost>
```

#### Nginx 配置示例 / Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/gh-helper;
    index GH_helper_super.html;
    
    # PHP 处理
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    # 保护敏感文件
    location ~ /secrets\.local\.php$ {
        deny all;
    }
    
    # 静态资源缓存
    location ~* \.(css|js|json)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }
    
    # 启用 Gzip 压缩
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

### 2.3 CDN 部署选项 / CDN Deployment Option

**中文**: 对于纯前端资源（HTML、CSS、JS、知识库），可以部署到 CDN 以提升加载速度。但 PHP 后端必须部署在支持 PHP 的服务器上。

**English**: Pure frontend resources (HTML, CSS, JS, knowledge base) can be deployed to CDN for faster loading. However, PHP backend must be deployed on a PHP-supported server.

---

## 3. 后端代理服务器架构 / Backend Proxy Server Architecture

### 3.1 PHP 环境要求 / PHP Environment Requirements

```bash
# PHP 版本 / PHP Version
PHP >= 7.4

# 必需扩展 / Required Extensions
- PDO (数据库访问)
- PDO_SQLite (SQLite 支持)
- JSON (JSON 处理)
- cURL (HTTP 请求)
- mbstring (多字节字符串)

# 推荐配置 / Recommended Configuration
memory_limit = 256M
max_execution_time = 60
post_max_size = 10M
upload_max_filesize = 10M
```

### 3.2 API 代理架构 / API Proxy Architecture

```javascript
/**
 * API 代理工作流程
 * API Proxy Workflow
 * 
 * 1. 接收前端请求
 * 2. 验证请求格式
 * 3. 从环境变量读取 API 密钥
 * 4. 转发请求到 DeepSeek API
 * 5. 接收响应并格式化
 * 6. 返回给前端
 */
```

### 3.3 secrets.local.php 配置示例

```php
<?php
/**
 * API 密钥配置
 * API Key Configuration
 * 
 * ⚠️ 安全警告 / Security Warning:
 * - 绝对不要将此文件提交到版本控制
 * - Never commit this file to version control
 * - 设置文件权限为 600 (仅所有者可读写)
 * - Set file permissions to 600 (owner read/write only)
 */

return [
    // DeepSeek API 密钥
    // DeepSeek API Key
    'deepseek_api_key' => 'YOUR_DEEPSEEK_API_KEY_HERE',
    
    // API 端点
    // API Endpoint
    'deepseek_api_url' => 'https://api.deepseek.com/v1/chat/completions',
    
    // 其他配置
    // Other configurations
    'max_tokens' => 64096,
    'timeout' => 120, // 秒 / seconds
];
```

**文件权限设置 / File Permission Setup**:
```bash
chmod 600 api/secrets.local.php
chown www-data:www-data api/secrets.local.php
```

---

## 4. 数据库设计 / Database Design

### 4.1 SQLite 数据库架构 / SQLite Database Schema

```sql
-- 启用 WAL 模式（提高并发性能）
-- Enable WAL mode (improve concurrent performance)
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ============================================================
-- 1. 用户表 / Users Table
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,  -- 应使用 password_hash() 加密
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT 1
);

-- ============================================================
-- 2. 对话会话表 / Conversations Table
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT DEFAULT '新对话',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 索引 / Index
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);

-- ============================================================
-- 3. 消息表 / Messages Table
-- ============================================================
CREATE TABLE IF NOT EXISTS chats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    conversation_id INTEGER NOT NULL DEFAULT 1,
    role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    reasoning_content TEXT,  -- 思维链内容 / Chain-of-Thought content
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 索引 / Index
CREATE INDEX idx_chats_conversation ON chats(conversation_id);
CREATE INDEX idx_chats_timestamp ON chats(timestamp DESC);

-- ============================================================
-- 4. 默认对话 / Default Conversation
-- ============================================================
INSERT OR IGNORE INTO conversations (id, user_id, title) 
VALUES (1, 0, '默认对话');
```

### 4.2 数据库优化建议 / Database Optimization Recommendations

**中文**:
1. **WAL 模式**: 提高读写并发性能
2. **索引优化**: 为常用查询字段创建索引
3. **定期清理**: 删除过期的对话和消息
4. **备份策略**: 定期备份 .db 文件

**English**:
1. **WAL Mode**: Improves read/write concurrent performance
2. **Index Optimization**: Create indexes for frequently queried fields
3. **Regular Cleanup**: Delete expired conversations and messages
4. **Backup Strategy**: Regularly backup .db file

---

## 5. 环境变量配置 / Environment Variable Configuration

### 5.1 .env 文件示例 / .env File Example

```bash
# ============================================================
# 环境变量配置
# Environment Variable Configuration
# 
# ⚠️ 不要将此文件提交到版本控制
# Do NOT commit this file to version control
# ============================================================

# API 配置 / API Configuration
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions

# 数据库配置 / Database Configuration
DB_PATH=/var/www/gh-helper/gh_data.db

# 应用配置 / Application Configuration
APP_ENV=production  # development | staging | production
APP_DEBUG=false
APP_NAME="GH Helper (OsmiaAI)"

# 安全配置 / Security Configuration
JWT_SECRET=your_jwt_secret_here
SESSION_TIMEOUT=3600  # 秒 / seconds

# 性能配置 / Performance Configuration
MAX_CONCURRENT_REQUESTS=10
REQUEST_TIMEOUT=120  # 秒 / seconds
CACHE_TTL=86400  # 24 小时 / 24 hours
```

### 5.2 加载环境变量 / Load Environment Variables

```php
<?php
// 使用 vlucas/phpdotenv 或自定义加载器
// Use vlucas/phpdotenv or custom loader

function loadEnv($path) {
    if (!file_exists($path)) {
        return;
    }
    
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue; // 跳过注释
        }
        
        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        
        putenv("$name=$value");
        $_ENV[$name] = $value;
        $_SERVER[$name] = $value;
    }
}

loadEnv(__DIR__ . '/.env');
```

---

## 6. 部署检查清单 / Deployment Checklist

### 6.1 部署前 / Before Deployment

- [ ] 配置 Web 服务器 (Apache/Nginx)
- [ ] 安装 PHP 7.4+ 及必需扩展
- [ ] 设置文件权限
- [ ] 配置 secrets.local.php
- [ ] 创建并配置 .env 文件
- [ ] 初始化 SQLite 数据库
- [ ] 测试 API 连通性

### 6.2 部署后 / After Deployment

- [ ] 访问首页确认加载正常
- [ ] 测试用户注册/登录
- [ ] 测试聊天功能
- [ ] 检查错误日志
- [ ] 配置 HTTPS 证书
- [ ] 设置数据库自动备份
- [ ] 配置监控和告警

---

## 7. 安全建议 / Security Recommendations

### 7.1 必须实施 / Must Implement

1. **HTTPS**: 生产环境必须启用 HTTPS
2. **文件权限**: 敏感文件设置为 600
3. **API 密钥保护**: 绝不暴露在前端代码中
4. **SQL 注入防护**: 使用预处理语句
5. **XSS 防护**: 转义用户输入

### 7.2 推荐实施 / Recommended

1. **Rate Limiting**: 限制 API 请求频率
2. **CORS 配置**: 限制允许的域名
3. **日志记录**: 记录所有 API 调用
4. **定期更新**: 更新依赖和 PHP 版本
5. **备份策略**: 自动备份数据库

---

## 8. 性能优化 / Performance Optimization

### 8.1 前端优化 / Frontend Optimization

- 启用 Gzip/Brotli 压缩
- 使用 CDN 加速静态资源
- 启用浏览器缓存
- 压缩 JavaScript 和 CSS
- 延迟加载知识库文件

### 8.2 后端优化 / Backend Optimization

- 使用 OPcache 加速 PHP
- SQLite WAL 模式
- 数据库索引优化
- 定期清理过期数据
- 使用连接池（如使用 MySQL）

---

**最后更新 / Last Updated**: 2026-04-10
