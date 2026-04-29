# 模块架构说明 / Module Architecture Guide

**项目名称 / Project Name**: GH Helper（小壁蜂OsmiaAI）  
**版本 / Version**: v0.3.8-beta  
**在线体验 / Live Demo**: https://topogenesis.top/intro/ghhelper  
**架构模式 / Architecture Pattern**: 分层架构 + 事件驱动 / Layered Architecture + Event-Driven

---

## 📋 概览 / Overview

**中文**: GH Helper（小壁蜂OsmiaAI） 采用清晰的分层架构设计，各层职责明确，通过事件总线进行松耦合通信。这种设计使得系统具有高度的可扩展性和可维护性。

**English**: GH Helper (OsmiaAI) adopts a clear layered architecture design with distinct responsibilities for each layer, communicating through an event bus for loose coupling. This design gives the system high scalability and maintainability.

---

## 🏗️ 架构分层 / Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│                 UI Layer (应用层)                    │
│  UIController, MarkdownRenderer, WiringPanelRenderer │
├─────────────────────────────────────────────────────┤
│              Workflow Layer (工作流层)                │
│         WorkflowEngine, Workflow Types               │
├─────────────────────────────────────────────────────┤
│               Agent Layer (智能体层)                  │
│   LeadAgent, SpecialistAgent, AgentFactory           │
├─────────────────────────────────────────────────────┤
│             Services Layer (服务层)                   │
│    LLMGateway, KnowledgeBaseService, SearchService   │
├─────────────────────────────────────────────────────┤
│               Core Layer (核心层)                     │
│      EventBus, AppStateStore, SessionRuntime         │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 1. 核心层 / Core Layer

### 1.1 EventBus (事件总线)

**文件 / File**: `core.js` → `EventBus` class

**中文**:
EventBus 是整个系统的事件中枢，采用发布-订阅模式，实现各模块间的解耦通信。

**核心功能**:
- `on(event, callback)`: 订阅事件
- `off(event, callback)`: 取消订阅
- `emit(event, payload)`: 发布事件

**架构价值 / Architecture Value**:

- 模块间零耦合，通过事件通信
- 支持一对多、多对多的事件分发
- 便于调试和日志记录

**English**:
EventBus is the event hub of the entire system, using the publish-subscribe pattern to achieve decoupled communication between modules.

**Core Functions**:
- `on(event, callback)`: Subscribe to events
- `off(event, callback)`: Unsubscribe
- `emit(event, payload)`: Publish events

**Design Advantages**:
- Zero coupling between modules, communicate through events
- Supports one-to-many and many-to-many event distribution
- Easy debugging and logging

**代码示例 / Code Example**:

```javascript
/**
 * EventBus - 事件总线实现
 * Event Bus Implementation
 * 
 * 设计模式: 发布-订阅 (Publish-Subscribe)
 * 用途: 解耦模块间通信，实现观察者模式
 */
class EventBus {
  constructor() {
    // 使用 Map 存储事件处理器，key 为事件名，value 为回调函数集合
    this.events = new Map();
  }

  /**
   * 订阅事件
   * Subscribe to an event
   * 
   * @param {string} event - 事件名称 / Event name
   * @param {Function} callback - 回调函数 / Callback function
   * @returns {Function} - 取消订阅函数 / Unsubscribe function
   */
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(callback);
    
    // 返回取消订阅函数，便于清理
    return () => this.off(event, callback);
  }

  /**
   * 取消订阅
   * Unsubscribe from an event
   */
  off(event, callback) {
    if (this.events.has(event)) {
      this.events.get(event).delete(callback);
    }
  }

  /**
   * 发布事件
   * Publish an event
   * 
   * @param {string} event - 事件名称 / Event name
   * @param {*} payload - 事件数据 / Event data
   */
  emit(event, payload) {
    if (this.events.has(event)) {
      this.events.get(event).forEach(callback => {
        try {
          callback(payload);
        } catch (e) {
          console.error(`[EventBus] Error in ${event}:`, e);
        }
      });
    }
  }
}
```

**典型事件流 / Typical Event Flow**:

```javascript
// 智能体状态变化 / Agent state change
eventBus.emit('agent:statusChange', { 
  role: 'methodology', 
  status: 'thinking' 
});

// LLM 使用统计 / LLM usage statistics
eventBus.emit('llm:usage', {
  inputTokens: 1500,
  outputTokens: 800,
  totalTokens: 2300
});

// 工作流状态更新 / Workflow state update
eventBus.emit('workflow:stateUpdate', {
  state: 'planning',
  progress: 0.3
});
```

---

### 1.2 AppStateStore (状态管理)

**文件 / File**: `core.js` → `AppStateStore` class

**中文**:
AppStateStore 是全局状态管理器，采用单一数据源原则，管理所有应用级别的状态。

**管理的状态**:
- 用户认证状态 (user, token, isAuthenticated)
- 激活的意图路由 (activeIntents)
- 当前会话信息 (currentSession)
- UI 状态 (darkMode, language)
- 配置信息 (apiBase, model)

**English**:
AppStateStore is the global state manager, following the single source of truth principle, managing all application-level states.

**Managed States**:
- User authentication state (user, token, isAuthenticated)
- Active intent routings (activeIntents)
- Current session info (currentSession)
- UI state (darkMode, language)
- Configuration (apiBase, model)

**代码示例 / Code Example**:

```javascript
/**
 * AppStateStore - 全局状态管理
 * Global State Management
 * 
 * 设计原则: 单一数据源 (Single Source of Truth)
 * 灵感来源: Redux/Vuex 的简化实现
 */
class AppStateStore {
  constructor() {
    this.state = {
      // 用户状态 / User state
      user: null,
      token: null,
      isAuthenticated: false,
      
      // 意图路由 / Intent routing
      activeIntents: new Set(['methodology']), // 默认激活方法架构
      
      // 会话状态 / Session state
      currentSession: null,
      messageHistory: [],
      
      // UI 状态 / UI state
      darkMode: false,
      language: 'zh',
      
      // 配置 / Configuration
      apiBase: '/api',
      model: 'deepseek-reasoner'
    };
    
    this.listeners = new Set();
  }

  /**
   * 获取状态
   * Get state
   */
  getState() {
    return this.state;
  }

  /**
   * 更新状态
   * Update state
   * 
   * @param {Object} updates - 状态更新对象 / State update object
   */
  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  /**
   * 订阅状态变化
   * Subscribe to state changes
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * 通知所有监听器
   * Notify all listeners
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
}
```

---

### 1.3 SessionRuntime (会话运行时)

**文件 / File**: `core.js` → `SessionRuntime` class

**中文**:
SessionRuntime 管理单次对话的完整生命周期，从用户输入到最终响应的所有状态转换。

**状态机 / State Machine**:

```
IDLE → ROUTING → PLANNING → RESEARCHING → SPAWNING_AGENTS 
→ AGENT_RUNNING → AGGREGATING → SELF_CRITIQUING → RESPONDING → IDLE
```

**English**:
SessionRuntime manages the complete lifecycle of a single conversation, all state transitions from user input to final response.

**代码示例 / Code Example**:

```javascript
/**
 * SessionRuntime - 会话运行时管理
 * Session Runtime Management
 * 
 * 职责: 管理单次对话的完整生命周期
 * Responsibility: Manage complete lifecycle of single conversation
 */
class SessionRuntime {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.state = RuntimeState.IDLE;
    this.workflow = null;
    this.agents = [];
  }

  /**
   * 开始新的会话
   * Start new session
   */
  async start(query, context) {
    this.transitionTo(RuntimeState.ROUTING);
    
    try {
      // 1. 意图路由 / Intent routing
      await this.routeIntent(query);
      
      // 2. 规划工作流 / Plan workflow
      this.transitionTo(RuntimeState.PLANNING);
      await this.planWorkflow(query);
      
      // 3. 知识检索 / Knowledge retrieval
      this.transitionTo(RuntimeState.RESEARCHING);
      await this.researchKnowledge(query);
      
      // 4. 生成智能体 / Spawn agents
      this.transitionTo(RuntimeState.SPAWNING_AGENTS);
      await this.spawnAgents();
      
      // 5. 执行智能体 / Execute agents
      this.transitionTo(RuntimeState.AGENT_RUNNING);
      const results = await this.executeAgents(query);
      
      // 6. 聚合结果 / Aggregate results
      this.transitionTo(RuntimeState.AGGREGATING);
      const aggregated = await this.aggregateResults(results);
      
      // 7. 自我批判 / Self-critique
      this.transitionTo(RuntimeState.SELF_CRITIQUING);
      const critiqued = await selfCritique(aggregated);
      
      // 8. 返回响应 / Return response
      this.transitionTo(RuntimeState.RESPONDING);
      return critiqued;
      
    } catch (error) {
      this.transitionTo(RuntimeState.ERROR);
      throw error;
    } finally {
      this.transitionTo(RuntimeState.IDLE);
    }
  }

  /**
   * 状态转换
   * State transition
   */
  transitionTo(newState) {
    this.state = newState;
    this.eventBus.emit('runtime:stateChange', { state: newState });
  }
}
```

---

### 1.4 常量定义 / Constants

**文件 / File**: `core.js` → Constant Objects

**中文**: 定义系统中使用的所有枚举常量和配置值。

**English**: Define all enum constants and configuration values used in the system.

```javascript
/**
 * RuntimeState - 运行时状态枚举
 * Runtime State Enumeration
 */
const RuntimeState = {
  IDLE: 'idle',                    // 空闲
  ROUTING: 'routing',              // 意图路由中
  PLANNING: 'planning',            // 规划工作流
  RESEARCHING: 'researching',      // 知识检索中
  SPAWNING_AGENTS: 'spawning',     // 生成智能体
  AGENT_RUNNING: 'running',        // 智能体执行中
  AGGREGATING: 'aggregating',      // 聚合结果
  SELF_CRITIQUING: 'critiquing',   // 自我批判
  SUMMARIZING_CONTEXT: 'summarizing', // 总结上下文
  RESPONDING: 'responding',        // 返回响应
  ERROR: 'error',                  // 错误状态
  PAUSED: 'paused'                 // 暂停
};

/**
 * WorkflowType - 工作流类型枚举
 * Workflow Type Enumeration
 */
const WorkflowType = {
  SIMPLE: 'simple_answer',              // 简单回答
  REACT: 'react_tool_loop',             // ReAct 工具循环
  SWARM: 'multi_agent_swarm',           // 多智能体集群
  RESEARCH: 'research_synthesis',       // 研究综合
  CODE: 'code_generation',              // 代码生成
  METHODOLOGY: 'deep_methodology_review' // 深度方法审查
};

/**
 * AgentRole - 智能体角色枚举
 * Agent Role Enumeration
 */
const AgentRole = {
  LEAD: 'lead',              // 主调度智能体
  METHODOLOGY: 'methodology', // 方法架构专家
  PLUGIN: 'plugin',          // 算法生态专家
  SCRIPT: 'script',          // 语法编程专家
  NODE: 'node',              // 组件推演专家
  DATATREE: 'datatree',      // 数据拓扑专家
  FABRICATION: 'fabrication', // 建造理化专家
  RESEARCH: 'research',      // 研究智能体
  KB_RECALL: 'kb_recall',    // 知识库召回
  CRITIC: 'critic',          // 批判智能体
  SYNTHESIZER: 'synthesizer'  // 综合智能体
};

/**
 * AgentStatus - 智能体状态枚举
 * Agent Status Enumeration
 */
const AgentStatus = {
  IDLE: 'idle',           // 空闲
  THINKING: 'thinking',   // 思考中
  ACTING: 'acting',       // 执行中
  WAITING: 'waiting',     // 等待中
  COMPLETED: 'completed', // 已完成
  ERROR: 'error'          // 错误
};
```

---

## 🌐 2. 服务层 / Services Layer

### 2.1 LLMGateway (LLM 网关)

**文件 / File**: `services.js` → `LLMGateway` class

**中文**:
LLMGateway 封装了与大语言模型的所有交互，包括请求队列管理、错误重试、流式处理等功能。

**核心职责**:
- 管理 API 请求队列，避免并发过多
- 处理错误和重试逻辑
- 支持流式和非流式两种调用模式
- 统计 Token 使用情况
- 通过事件总线广播使用统计

**English**:
LLMGateway encapsulates all interactions with large language models, including request queue management, error retry, streaming, and other features.

**Core Responsibilities**:
- Manage API request queue to avoid excessive concurrency
- Handle error and retry logic
- Support both streaming and non-streaming call modes
- Track Token usage statistics
- Broadcast usage statistics via event bus

**代码示例 / Code Example**:

```javascript
/**
 * LLMGateway - 大语言模型网关
 * Large Language Model Gateway
 * 
 * 职责: 封装所有 LLM API 调用，提供统一的接口
 * Responsibility: Encapsulate all LLM API calls, provide unified interface
 */
class LLMGateway {
  constructor(apiBase, eventBus) {
    this.apiBase = apiBase;  // 代理服务器地址 / Proxy server URL
    this.eventBus = eventBus;
    this.requestQueue = [];      // 请求队列 / Request queue
    this.isProcessing = false;   // 是否正在处理 / Processing flag
    this.maxConcurrent = 3;      // 最大并发数 / Max concurrent requests
  }

  /**
   * 完成请求
   * Complete request
   * 
   * @param {Array} messages - 消息历史 / Message history
   * @param {Object} options - 请求选项 / Request options
   * @returns {Promise<Object>} - 响应结果 / Response result
   */
  async complete(messages, options = {}) {
    const {
      model = 'deepseek-reasoner',
      temperature = 0.5,
      maxTokens = 64096,
      stream = false,
      onStreamDelta = null
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
      // 通过本地代理发送请求 / Send request through local proxy
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
      
      // 验证响应格式 / Validate response format
      if (!result.success || !result.data) {
        throw new Error('Invalid response format from proxy');
      }

      const data = result.data;
      const usage = data.usage || {};
      
      // 广播使用统计 / Broadcast usage statistics
      this.eventBus.emit('llm:usage', {
        inputTokens: usage.prompt_tokens || 0,
        outputTokens: usage.completion_tokens || 0,
        totalTokens: usage.total_tokens || 0
      });

      return {
        content: data.choices[0].message.content,
        reasoningContent: data.choices[0].message.reasoning_content || null,
        finishReason: data.choices[0].finish_reason,
        usage: usage
      };
    } catch (error) {
      this.eventBus.emit('llm:error', error);
      throw error;
    }
  }
}
```

---

### 2.2 KnowledgeBaseService (知识库服务)

**文件 / File**: `services.js` → `KnowledgeBaseService` class

**中文**:
KnowledgeBaseService 负责加载、索引和检索本地知识库，为 AI 提供准确的参数化设计知识。

**核心功能**:
- 加载知识库索引 (index.json)
- 根据关键词匹配知识集合
- 加载具体知识文件
- 缓存已加载的知识

**English**:
KnowledgeBaseService is responsible for loading, indexing, and retrieving local knowledge base, providing accurate parametric design knowledge for AI.

**Core Functions**:
- Load knowledge base index (index.json)
- Match knowledge collections by keywords
- Load specific knowledge files
- Cache loaded knowledge

**代码示例 / Code Example**:

```javascript
/**
 * KnowledgeBaseService - 知识库服务
 * Knowledge Base Service
 * 
 * 职责: 管理本地知识库的加载和检索
 * Responsibility: Manage local knowledge base loading and retrieval
 */
class KnowledgeBaseService {
  constructor() {
    this.index = null;         // 知识库索引 / Knowledge index
    this.collections = new Map(); // 已加载的知识集合 / Loaded collections
    this.cache = new Map();    // 内容缓存 / Content cache
  }

  /**
   * 初始化知识库
   * Initialize knowledge base
   */
  async initialize(indexUrl) {
    const response = await fetch(indexUrl);
    this.index = await response.json();
  }

  /**
   * 根据关键词检索知识
   * Retrieve knowledge by keywords
   * 
   * @param {string} query - 用户查询 / User query
   * @returns {Array} - 匹配的知识集合 / Matched collections
   */
  search(query) {
    if (!this.index) return [];

    const queryTerms = query.toLowerCase().split(/\s+/);
    const results = [];

    // 遍历所有知识集合 / Iterate all collections
    for (const collection of this.index.collections) {
      let score = 0;

      // 匹配关键词 / Match keywords
      for (const keyword of collection.keywords) {
        if (queryTerms.some(term => keyword.toLowerCase().includes(term))) {
          score += collection.priority;
        }
      }

      // 匹配场景 / Match scenarios
      for (const scenario of collection.scenarios) {
        if (query.toLowerCase().includes(scenario.toLowerCase())) {
          score += collection.priority * 2; // 场景匹配权重更高 / Scenario match has higher weight
        }
      }

      if (score > 0) {
        results.push({ collection, score });
      }
    }

    // 按分数排序 / Sort by score
    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * 加载知识集合
   * Load knowledge collection
   */
  async loadCollection(collectionId) {
    if (this.cache.has(collectionId)) {
      return this.cache.get(collectionId);
    }

    const collection = this.index.collections.find(c => c.id === collectionId);
    if (!collection) return null;

    const response = await fetch(`knowledge/${collection.file}`);
    const data = await response.json();
    
    this.cache.set(collectionId, data);
    return data;
  }
}
```

---

### 2.3 SearchService (搜索服务)

**文件 / File**: `services.js` → `SearchService` class

**中文**:
SearchService 提供增强的搜索功能，结合关键词匹配和语义理解，从知识库中检索最相关的内容。

**English**:
SearchService provides enhanced search functionality, combining keyword matching and semantic understanding to retrieve the most relevant content from the knowledge base.

---

## 🤖 3. 智能体层 / Agent Layer

### 3.1 Agent 基类 / Agent Base Class

**文件 / File**: `agents.js` → `Agent` class

**中文**:
Agent 是所有智能体的基类，定义了智能体的基本行为和状态管理。

**核心特性**:
- 状态管理 (通过 EventBus 广播)
- 历史记录
- 统一的执行接口
- 图标映射

**English**:
Agent is the base class for all agents, defining basic behaviors and state management.

**Core Features**:
- State management (broadcast via EventBus)
- History tracking
- Unified execution interface
- Icon mapping

**代码示例 / Code Example**:

```javascript
/**
 * Agent - 智能体基类
 * Agent Base Class
 * 
 * 设计模式: 模板方法模式 (Template Method Pattern)
 * 用途: 定义智能体的通用行为，子类实现具体逻辑
 */
class Agent {
  /**
   * 构造函数
   * Constructor
   * 
   * @param {string} role - 智能体角色 / Agent role
   * @param {LLMGateway} llmGateway - LLM 网关 / LLM gateway
   * @param {EventBus} eventBus - 事件总线 / Event bus
   */
  constructor(role, llmGateway, eventBus) {
    this.role = role;
    this.llmGateway = llmGateway;
    this.eventBus = eventBus;
    this.status = AgentStatus.IDLE;
    this.history = [];
  }

  /**
   * 获取角色图标
   * Get role icon
   */
  getIcon() {
    const icons = {
      [AgentRole.LEAD]: '🎯',
      [AgentRole.METHODOLOGY]: '🏗️',
      [AgentRole.PLUGIN]: '🔌',
      [AgentRole.SCRIPT]: '💻',
      [AgentRole.NODE]: '🔧',
      [AgentRole.DATATREE]: '🌳',
      [AgentRole.FABRICATION]: '🏭',
      [AgentRole.RESEARCH]: '🔍',
      [AgentRole.KB_RECALL]: '📚',
      [AgentRole.CRITIC]: '🔎',
      [AgentRole.SYNTHESIZER]: '🧩'
    };
    return icons[this.role] || '🤖';
  }

  /**
   * 设置状态
   * Set status
   */
  setStatus(status) {
    this.status = status;
    this.eventBus.emit('agent:statusChange', { 
      role: this.role, 
      status 
    });
  }

  /**
   * 执行任务
   * Execute task
   * 
   * @param {Object} task - 任务描述 / Task description
   * @param {string} query - 用户查询 / User query
   * @param {Object} context - 上下文 / Context
   * @returns {Promise<string>} - 执行结果 / Execution result
   */
  async execute(task, query, context) {
    this.setStatus(AgentStatus.THINKING);
    
    const prompt = this.buildPrompt(task, query, context);
    const response = await this.llmGateway.complete(prompt);
    
    this.setStatus(AgentStatus.COMPLETED);
    return response.content;
  }

  /**
   * 构建提示词 (子类重写)
   * Build prompt (override in subclass)
   */
  buildPrompt(task, query, context) {
    return [
      { role: 'system', content: this.getSystemPrompt() },
      { role: 'user', content: `Task: ${task.description}\n\nQuery: ${query}` }
    ];
  }

  /**
   * 获取系统提示词 (子类重写)
   * Get system prompt (override in subclass)
   */
  getSystemPrompt() {
    return `You are a ${this.role} specialist assistant.`;
  }
}
```

---

### 3.2 LeadAgent (主调度智能体)

**文件 / File**: `agents.js` → `LeadAgent` class

**中文**:
LeadAgent 是系统的"大脑"，负责分析用户意图、制定执行计划、协调各个专家智能体。

**核心职责**:
- 分析用户查询
- 制定多阶段执行计划
- 分配任务给专家智能体
- 聚合各智能体的结果

**English**:
LeadAgent is the "brain" of the system, responsible for analyzing user intent, creating execution plans, and coordinating specialist agents.

**Core Responsibilities**:
- Analyze user queries
- Create multi-phase execution plans
- Assign tasks to specialist agents
- Aggregate results from all agents

---

### 3.3 SpecialistAgent (专家智能体)

**文件 / File**: `agents.js` → `SpecialistAgent` class

**中文**:
SpecialistAgent 代表各个领域的专家，如方法架构、数据拓扑、建造理化等。每个专家都有独特的系统提示词和专业视角。

**六大专家路由**:
1. Methodology - 方法架构
2. Plugin - 算法生态
3. Script - 语法编程
4. Node - 组件推演
5. DataTree - 数据拓扑
6. Fabrication - 建造理化

**English**:
SpecialistAgent represents experts in various fields such as methodology, data topology, fabrication, etc. Each expert has unique system prompts and professional perspectives.

---

### 3.4 AgentFactory (智能体工厂)

**文件 / File**: `agents.js` → `AgentFactory` class

**中文**:
AgentFactory 使用工厂模式根据角色名称创建对应的智能体实例，简化智能体的创建流程。

**English**:
AgentFactory uses the Factory Pattern to create agent instances based on role names, simplifying the agent creation process.

---

## ⚙️ 4. 工作流层 / Workflow Layer

### 4.1 WorkflowEngine (工作流引擎)

**文件 / File**: `workflows.js` → `WorkflowEngine` class

**中文**:
WorkflowEngine 根据任务复杂度选择合适的工作流类型，并 orchestrates 整个执行过程。

**支持的工作流类型**:
- **Simple Answer**: 简单问题，直接回答
- **ReAct Tool Loop**: 需要工具调用的复杂推理
- **Multi-Agent Swarm**: 多智能体并行执行
- **Research Synthesis**: 深度研究综合
- **Code Generation**: 代码生成

**English**:
WorkflowEngine selects appropriate workflow type based on task complexity and orchestrates the entire execution process.

---

## 🎨 5. UI 渲染层 / UI Rendering Layer

### 5.1 WiringPanelRenderer (连线面板渲染器)

**文件 / File**: `wiring-panel.js` → `WiringPanelRenderer` class

**中文**:
WiringPanelRenderer 使用 SVG Canvas 渲染 Grasshopper 风格的电池组连线图，直观展示组件连接逻辑和数据流。

**核心功能**:
- SVG 节点渲染 (GH 风格配色)
- 端口布局计算
- 贝塞尔曲线连线
- 缩放和平移支持
- 节点清单生成

**English**:
WiringPanelRenderer uses SVG Canvas to render Grasshopper-style battery wiring diagrams, intuitively displaying component connection logic and data flow.

**Core Functions**:
- SVG node rendering (GH-style color scheme)
- Port layout calculation
- Bezier curve wiring
- Zoom and pan support
- Node list generation

---

### 5.2 CodePanelRenderer (代码面板渲染器)

**文件 / File**: `code-panel.js` → `CodePanelRenderer` class

**中文**:
CodePanelRenderer 负责渲染代码块，支持语法高亮、一键复制等功能。

**English**:
CodePanelRenderer is responsible for rendering code blocks, supporting syntax highlighting, one-click copy, and other features.

---

## 📊 模块交互图 / Module Interaction Diagram

```
用户输入
  ↓
UIController (app.js)
  ↓
EventBus.emit('user:input', query)
  ↓
SessionRuntime.start(query)
  ↓
┌─→ KnowledgeBaseService.search(query)
│     ↓
│   检索知识库
│
├─→ LeadAgent.plan(query)
│     ↓
│   制定执行计划
│
├─→ AgentFactory.createAgents(plan)
│     ↓
│   创建专家智能体
│
├─→ WorkflowEngine.execute(plan, agents)
│     ↓
│   执行工作流
│     ↓
│   LLMGateway.complete(prompts)
│     ↓
│   调用 AI API
│
└─→ 聚合结果
      ↓
  EventBus.emit('session:complete', result)
      ↓
  UIController.renderResponse(result)
```

---

## 🎯 设计模式总结 / Design Patterns Summary

| 模式 / Pattern | 应用位置 / Location | 作用 / Purpose |
|---------------|-------------------|---------------|
| 发布-订阅 / Pub-Sub | EventBus | 模块解耦 / Module decoupling |
| 单一数据源 / Single Source | AppStateStore | 状态管理 / State management |
| 状态机 / State Machine | SessionRuntime, Agent | 生命周期管理 / Lifecycle management |
| 工厂模式 / Factory | AgentFactory | 对象创建 / Object creation |
| 模板方法 / Template Method | Agent 基类 | 代码复用 / Code reuse |
| 策略模式 / Strategy | WorkflowEngine | 算法选择 / Algorithm selection |
| 代理模式 / Proxy | LLMGateway | 访问控制 / Access control |
| 观察者 / Observer | 状态订阅 | 响应式更新 / Reactive updates |

---

**最后更新 / Last Updated**: 2026-04-10
