# API 参考文档 / API Reference

**项目名称 / Project Name**: GH Helper（小壁蜂OsmiaAI）  
**版本 / Version**: v0.3.8-beta  
**在线体验 / Live Demo**: https://topogenesis.top/intro/ghhelper  
**基础架构 / Base Architecture**: RESTful + 代理模式 / Proxy Pattern

---

## 📋 概览 / Overview

**中文**: 本文档描述了 GH Helper 系统的 API 接口架构。所有 API 调用均通过本地代理服务器进行，前端不直接访问外部 AI 服务提供商，确保 API 密钥的安全性和请求的可控性。

**English**: This document describes the API interface architecture of the GH Helper system. All API calls are made through a local proxy server. The frontend does not directly access external AI service providers, ensuring the security of API keys and controllability of requests.

---

## 🔐 安全架构 / Security Architecture

### 代理模式 / Proxy Pattern

**中文**: 
系统采用后端代理模式，架构如下：
```
前端 (Browser) → 本地代理 (PHP) → 外部 AI API (DeepSeek)
```

优势：
- API 密钥存储在服务器端，不暴露给前端
- 可以实施请求限流和访问控制
- 支持请求日志记录和监控
- 可以添加自定义的业务逻辑

**English**:
The system adopts a backend proxy mode with the following architecture:
```
Frontend (Browser) → Local Proxy (PHP) → External AI API (DeepSeek)
```

Advantages:
- API keys are stored server-side, not exposed to frontend
- Can implement rate limiting and access control
- Supports request logging and monitoring
- Can add custom business logic

---

## 💬 1. 聊天接口 / Chat Endpoint

### 1.1 端点信息 / Endpoint Info

**中文**:
- **路径 / Path**: `/api/chat.php`
- **方法 / Method**: `POST`
- **内容类型 / Content-Type**: `application/json`

**English**:
- **Path**: `/api/chat.php`
- **Method**: `POST`
- **Content-Type**: `application/json`

### 1.2 请求格式 / Request Format

```json
{
  "model": "deepseek-reasoner",
  "messages": [
    {
      "role": "system",
      "content": "你是由 cf 开发的 Grasshopper 参数化设计专家助手..."
    },
    {
      "role": "user",
      "content": "如何创建一个渐变圆管？"
    }
  ],
  "max_tokens": 64096,
  "temperature": 0.5,
  "stream": false,
  "top_p": 1.0
}
```

**参数说明 / Parameters**:

| 参数 / Parameter | 类型 / Type | 必填 / Required | 说明 / Description |
|-----------------|------------|----------------|-------------------|
| model | string | 是 / Yes | 模型名称 / Model name (e.g., "deepseek-reasoner") |
| messages | array | 是 / Yes | 消息历史数组 / Message history array |
| messages[].role | string | 是 / Yes | 角色: "system", "user", "assistant" |
| messages[].content | string | 是 / Yes | 消息内容 / Message content |
| max_tokens | integer | 否 / No | 最大生成 token 数 / Max generation tokens (default: 64096) |
| temperature | float | 否 / No | 随机性控制 / Randomness control (0.0-1.0, default: 0.5) |
| stream | boolean | 否 / No | 是否启用流式输出 / Enable streaming output (default: false) |
| top_p | float | 否 / No | 核采样参数 / Nucleus sampling parameter (default: 1.0) |

### 1.3 响应格式 / Response Format

**成功响应 / Success Response** (HTTP 200):

```json
{
  "success": true,
  "data": {
    "id": "chatcmpl-abc123",
    "object": "chat.completion",
    "created": 1234567890,
    "model": "deepseek-reasoner",
    "choices": [
      {
        "index": 0,
        "message": {
          "role": "assistant",
          "content": "要创建渐变圆管，您需要...\n\n[详细步骤]",
          "reasoning_content": "首先分析用户需求...\n\n[思维链内容]"
        },
        "finish_reason": "stop"
      }
    ],
    "usage": {
      "prompt_tokens": 1500,
      "completion_tokens": 800,
      "total_tokens": 2300
    }
  }
}
```

**错误响应 / Error Response** (HTTP 4xx/5xx):

```json
{
  "success": false,
  "error": "错误描述 / Error description",
  "message": "详细的错误信息 / Detailed error message"
}
```

### 1.4 流式处理机制 / Streaming Mechanism

**中文**:
当 `stream: true` 时，服务器会返回 Server-Sent Events (SSE) 流：

```
data: {"choices": [{"delta": {"content": "要"}, "finish_reason": null}]}

data: {"choices": [{"delta": {"content": "创建"}, "finish_reason": null}]}

data: {"choices": [{"delta": {}, "finish_reason": "stop"}]}
```

前端需要监听 `onmessage` 事件并逐步累积内容。

**English**:
When `stream: true`, the server returns Server-Sent Events (SSE) stream:

```
data: {"choices": [{"delta": {"content": "To"}, "finish_reason": null}]}

data: {"choices": [{"delta": {"content": "create"}, "finish_reason": null}]}

data: {"choices": [{"delta": {}, "finish_reason": "stop"}]}
```

The frontend needs to listen to `onmessage` events and accumulate content progressively.

### 1.5 特殊字段 / Special Fields

**reasoning_content 字段 / reasoning_content Field**:

**中文**: DeepSeek-Reasoner 模型特有的字段，包含模型的思维链（Chain-of-Thought）内容。系统会拦截此字段并在 UI 中通过可折叠面板外显，让用户看到 AI 的推理过程。

**English**: A special field unique to the DeepSeek-Reasoner model, containing the model's Chain-of-Thought content. The system intercepts this field and exposes it in the UI through a collapsible panel, allowing users to see the AI's reasoning process.

---

## 👤 2. 用户认证接口 / Auth Endpoint

### 2.1 端点信息 / Endpoint Info

**中文**:
- **路径 / Path**: `/gha_api.php?action={action}`
- **方法 / Method**: `POST`
- **认证方式 / Authentication**: Token-based (自定义 Base64 编码)

**English**:
- **Path**: `/gha_api.php?action={action}`
- **Method**: `POST`
- **Authentication**: Token-based (custom Base64 encoding)

### 2.2 用户注册 / User Registration

**请求 / Request** (`?action=register`):

```json
{
  "username": "user123",
  "password": "hashed_password"
}
```

**响应 / Response**:

```json
{
  "success": true,
  "token": "base64_encoded_token",
  "user_id": 42,
  "username": "user123"
}
```

### 2.3 用户登录 / User Login

**请求 / Request** (`?action=login`):

```json
{
  "username": "user123",
  "password": "hashed_password"
}
```

**响应 / Response**:

```json
{
  "success": true,
  "token": "base64_encoded_token",
  "user_id": 42,
  "username": "user123"
}
```

### 2.4 Token 验证 / Token Verification

**请求 / Request** (`?action=verify`):

```json
{
  "token": "base64_encoded_token"
}
```

**响应 / Response**:

```json
{
  "success": true,
  "user_id": 42,
  "username": "user123"
}
```

**安全说明 / Security Note**:

**中文**: 当前实现使用简单的 Base64 编码 Token，生产环境应升级为 JWT 或其他更安全的认证机制。

**English**: The current implementation uses simple Base64 encoded tokens. Production environments should upgrade to JWT or other more secure authentication mechanisms.

---

## 💾 3. 对话管理接口 / Conversation Management Endpoints

### 3.1 保存消息 / Save Message

**请求 / Request** (`?action=save_message`):

```json
{
  "token": "user_token",
  "conversation_id": 1,
  "role": "user",
  "content": "用户消息内容"
}
```

**响应 / Response**:

```json
{
  "success": true,
  "message_id": 123
}
```

### 3.2 获取对话历史 / Get Conversation History

**请求 / Request** (`?action=get_history`):

```json
{
  "token": "user_token",
  "conversation_id": 1
}
```

**响应 / Response**:

```json
{
  "success": true,
  "messages": [
    {
      "id": 1,
      "role": "user",
      "content": "用户消息",
      "timestamp": "2026-04-10 10:00:00"
    },
    {
      "id": 2,
      "role": "assistant",
      "content": "AI 回复",
      "timestamp": "2026-04-10 10:00:05"
    }
  ]
}
```

### 3.3 获取对话列表 / Get Conversation List

**请求 / Request** (`?action=get_conversations`):

```json
{
  "token": "user_token"
}
```

**响应 / Response**:

```json
{
  "success": true,
  "conversations": [
    {
      "id": 1,
      "title": "渐变圆管设计",
      "created_at": "2026-04-10 10:00:00",
      "updated_at": "2026-04-10 10:30:00"
    }
  ]
}
```

### 3.4 删除对话 / Delete Conversation

**请求 / Request** (`?action=delete_conversation`):

```json
{
  "token": "user_token",
  "conversation_id": 1
}
```

**响应 / Response**:

```json
{
  "success": true
}
```

---

## 📚 4. 知识库检索接口 / Knowledge Base Endpoint

### 4.1 架构说明 / Architecture Description

**中文**:
知识库检索在前端完成，不涉及后端 API。系统通过以下流程工作：

1. 加载 `knowledge/index.json` 索引文件
2. 根据用户输入提取关键词
3. 匹配知识库集合的 keywords 和 scenarios 字段
4. 加载匹配的知识文件（JSON 格式）
5. 将知识内容注入到 System Prompt 中

**English**:
Knowledge base retrieval is completed on the frontend without involving backend APIs. The system works through the following process:

1. Load `knowledge/index.json` index file
2. Extract keywords from user input
3. Match knowledge collection's keywords and scenarios fields
4. Load matched knowledge files (JSON format)
5. Inject knowledge content into System Prompt

### 4.2 知识库索引结构 / Knowledge Base Index Structure

```json
{
  "version": "0.3.5-beta-kb3",
  "updated_at": "2026-04-04",
  "collections": [
    {
      "id": "gh_params_input",
      "title": "输入与参数控制",
      "file": "native/gh_params_input.json",
      "keywords": ["参数", "输入", "slider", "toggle"],
      "scenarios": ["参数控制", "数据查看"],
      "priority": 3
    }
  ]
}
```

### 4.3 知识集合结构 / Knowledge Collection Structure

```json
{
  "components": [
    {
      "name": "Component Name",
      "category": "Category",
      "description": "Description text",
      "inputs": [
        {"name": "Input A", "type": "Type", "description": "Description"}
      ],
      "outputs": [
        {"name": "Output A", "type": "Type", "description": "Description"}
      ],
      "usage_notes": "Usage notes"
    }
  ]
}
```

---

## 📤 5. 数据导出接口 / Data Export Endpoint

### 5.1 端点信息 / Endpoint Info

**中文**:
- **路径 / Path**: `/gha_api.php?action=export`
- **方法 / Method**: `POST`
- **返回格式 / Return Format**: JSON (前端转换为文件下载)

**English**:
- **Path**: `/gha_api.php?action=export`
- **Method**: `POST`
- **Return Format**: JSON (frontend converts to file download)

### 5.2 请求格式 / Request Format

```json
{
  "token": "user_token",
  "conversation_id": 1,
  "format": "json"
}
```

### 5.3 响应格式 / Response Format

```json
{
  "success": true,
  "export_data": {
    "conversation": {
      "id": 1,
      "title": "对话标题",
      "created_at": "2026-04-10 10:00:00"
    },
    "messages": [
      {
        "role": "user",
        "content": "用户消息",
        "timestamp": "2026-04-10 10:00:00"
      }
    ]
  }
}
```

---

## ⚠️ 错误码说明 / Error Codes

| HTTP 状态码 / Status Code | 错误类型 / Error Type | 说明 / Description |
|--------------------------|----------------------|-------------------|
| 400 | Bad Request | 请求格式错误 / Invalid request format |
| 401 | Unauthorized | Token 无效或过期 / Invalid or expired token |
| 404 | Not Found | 资源不存在 / Resource not found |
| 500 | Internal Server Error | 服务器内部错误 / Internal server error |
| 502 | Bad Gateway | 上游 AI API 错误 / Upstream AI API error |
| 503 | Service Unavailable | 服务暂时不可用 / Service temporarily unavailable |

---

## 🔧 实现示例 / Implementation Example

### 前端调用示例 / Frontend Call Example

```javascript
// LLMGateway 抽象实现 / LLMGateway abstract implementation
class LLMGateway {
  constructor(apiBase, eventBus) {
    this.apiBase = apiBase;  // 例如: '/api'
    this.eventBus = eventBus;
  }

  async complete(messages, options = {}) {
    const {
      model = 'deepseek-reasoner',
      temperature = 0.5,
      maxTokens = 64096,
      stream = false
    } = options;

    const requestBody = {
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
      stream,
      top_p: 1.0
    };

    try {
      const response = await fetch(`${this.apiBase}/chat.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error('Invalid response format');
      }

      const data = result.data;
      
      return {
        content: data.choices[0].message.content,
        reasoningContent: data.choices[0].message.reasoning_content || null,
        finishReason: data.choices[0].finish_reason,
        usage: data.usage || {}
      };
    } catch (error) {
      this.eventBus.emit('llm:error', error);
      throw error;
    }
  }
}
```

---

## 📝 注意事项 / Notes

**中文**:
1. 所有敏感操作都需要有效的 Token
2. API 密钥绝对不能暴露在前端代码中
3. 生产环境应实施请求限流
4. 建议添加请求日志和监控
5. Token 机制应升级为 JWT

**English**:
1. All sensitive operations require valid tokens
2. API keys must never be exposed in frontend code
3. Production environments should implement rate limiting
4. Request logging and monitoring are recommended
5. Token mechanism should be upgraded to JWT

---

**最后更新 / Last Updated**: 2026-04-10
