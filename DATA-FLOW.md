# 数据流图 / Data Flow Diagram

**项目名称 / Project Name**: GH Helper（小壁蜂OsmiaAI）  
**版本 / Version**: v0.3.6-beta  
**在线体验 / Live Demo**: https://topogenesis.top/intro/ghhelper  
**文档类型 / Document Type**: 架构流程图 / Architecture Flow Diagrams

---

## 📋 概览 / Overview

**中文**: 本文档通过 Mermaid 图表详细展示 GH Helper（小壁蜂OsmiaAI） 系统中的关键数据流，包括用户输入到响应的完整流程、JIT 编译流程、多智能体协作流程和知识库检索流程。

**English**: This document uses Mermaid diagrams to detail key data flows in the GH Helper (OsmiaAI) system, including the complete flow from user input to response, JIT compilation flow, multi-agent collaboration flow, and knowledge base retrieval flow.

---

## 1. 用户输入到响应的完整数据流
## 1. Complete Data Flow from User Input to Response

### 1.1 主流程图 / Main Flowchart

```mermaid
graph TB
    Start([用户输入查询]) --> UI[UIController 接收输入]
    UI --> Emit[EventBus.emit user:input]
    Emit --> Runtime[SessionRuntime.start]
    
    Runtime --> Check{用户是否认证?}
    Check -->|是/Yes| SaveHistory[保存到数据库]
    Check -->|否/No| LocalOnly[仅本地处理]
    
    SaveHistory --> Route
    LocalOnly --> Route[意图路由分析]
    
    Route --> KB[KnowledgeBaseService.search]
    KB --> Match{匹配知识?}
    Match -->|是/Yes| LoadKB[加载知识库]
    Match -->|否/No| SkipKB[跳过知识注入]
    
    LoadKB --> JIT
    SkipKB --> JIT[JIT Prompt 编译]
    
    JIT --> Compile[生成超级系统提示词]
    Compile --> Workflow[WorkflowEngine 选择工作流]
    
    Workflow --> Type{工作流类型?}
    Type -->|Simple| Simple[简单回答]
    Type -->|Swarm| Swarm[多智能体集群]
    Type -->|Research| Research[深度研究]
    Type -->|Code| Code[代码生成]
    
    Simple --> LLM
    Swarm --> MultiAgent
    Research --> LLM
    Code --> LLM
    
    MultiAgent[多智能体并行执行] --> Aggregate[聚合结果]
    Aggregate --> Critic[批判验证]
    Critic --> LLM
    
    LLM[LLMGateway.complete] --> API[调用 AI API]
    API --> Response[获取响应]
    
    Response --> Parse{包含 reasoning?}
    Parse -->|是/Yes| ShowReason[显示思维链]
    Parse -->|否/No| SkipReason[跳过思维链]
    
    ShowReason --> Render
    SkipReason --> Render[UIController.renderResponse]
    
    Render --> SaveMsg[保存消息历史]
    SaveMsg --> End([返回给用户])
    
    style JIT fill:#f9f,stroke:#333,stroke-width:3px
    style MultiAgent fill:#bbf,stroke:#333,stroke-width:3px
    style LLM fill:#bfb,stroke:#333,stroke-width:3px
```

### 1.2 时序图 / Sequence Diagram

```mermaid
sequenceDiagram
    participant User as 用户
    participant UI as UIController
    participant Runtime as SessionRuntime
    participant KB as KnowledgeBase
    participant JIT as JIT Compiler
    participant Agent as Agents
    participant LLM as LLMGateway
    participant API as AI API
    
    User->>UI: 输入查询
    UI->>Runtime: start(query)
    
    activate Runtime
    Runtime->>Runtime: 状态: ROUTING
    
    Runtime->>KB: search(query)
    KB-->>Runtime: 匹配的知识
    
    Runtime->>JIT: generateSystemPrompt()
    JIT-->>Runtime: 超级提示词
    
    Runtime->>Agent: spawnAgents()
    Agent->>Agent: 构建提示词
    
    Agent->>LLM: complete(messages)
    LLM->>API: POST /api/chat.php
    API-->>LLM: 响应数据
    LLM-->>Agent: response.content
    
    Agent-->>Runtime: 执行结果
    Runtime->>Runtime: 状态: AGGREGATING
    Runtime->>Runtime: 状态: RESPONDING
    
    Runtime-->>UI: 最终响应
    UI-->>User: 显示结果
    deactivate Runtime
```

---

## 2. JIT 编译流程详解
## 2. JIT Compilation Flow Details

### 2.1 编译流程图 / Compilation Flowchart

```mermaid
graph LR
    Start([状态变更]) --> Check{activeIntents 变化?}
    
    Check -->|是/Yes| Extract[抽提专家特征]
    Check -->|否/No| Wait[等待]
    
    Extract --> Roles[收集 Roles]
    Extract --> Debates[收集 Debates]
    Extract --> Outputs[收集 Outputs]
    
    Roles --> Assemble[组装提示词]
    Debates --> Assemble
    Outputs --> Assemble
    
    Assemble --> Scene[1. 场景构建]
    Scene --> Personality[2. 人格注入]
    Personality --> Adversarial[3. 对抗规则声明]
    Adversarial --> Format[4. 输出格式钳制]
    
    Format --> Final[生成最终 Prompt]
    Final --> Cache{缓存?}
    
    Cache -->|是/Yes| Store[存储到 SessionRuntime]
    Cache -->|否/No| Store
    
    Store --> End([完成])
    
    style Assemble fill:#ff9,stroke:#333,stroke-width:2px
    style Final fill:#f9f,stroke:#333,stroke-width:2px
```

### 2.2 编译结果示例 / Compilation Result Example

**输入 / Input**:
```javascript
activeIntents = ['datatree', 'plugins', 'fabrication']
```

**输出 / Output**:
```
你是由 cf 开发的 Grasshopper 参数化设计专家助手。
当前激活的专家团队阵容：
- **数据拓扑架构师 (Data Topology Architect)**
- **算法生态专家 (Ecosystem Algorithm Specialist)**
- **建造理化专家 (Fabrication Rationalization Expert)**

【强制交叉研讨与防幻觉机制】
- 【关于专家职能】：死磕 Grasshopper 的灵魂：数据树...
- 【关于专家职能】：评估是否引入第三方算法库...
- 【关于专家职能】：评估几何降阶策略...

【强制输出结构约束】
1. 需求技术锚点解析
<<<SPLIT>>>
输入端数据结构深度剖析
<<<SPLIT>>>
核心树形操作介入节点
<<<SPLIT>>>
最优生态插件架构方案
<<<SPLIT>>>
原生降级替代思路
<<<SPLIT>>>
建造理化策略深度评估
```

---

## 3. 多智能体协作流程
## 3. Multi-Agent Collaboration Flow

### 3.1 协作架构图 / Collaboration Architecture

```mermaid
graph TB
    UserQuery([用户查询]) --> Lead[LeadAgent 主调度]
    
    Lead --> Analyze[分析意图]
    Analyze --> Plan[制定计划]
    
    Plan --> P1{阶段 1}
    Plan --> P2{阶段 2}
    Plan --> P3{阶段 3}
    
    P1 --> KB_Agent[KB_Recall Agent]
    KB_Agent --> Search[检索知识库]
    Search --> K1[gh_math_sets_tree]
    Search --> K2[gh_curve_surface_solid]
    
    P2 --> Expert1[DataTree Agent]
    P2 --> Expert2[Plugin Agent]
    P2 --> Expert3[Fabrication Agent]
    
    Expert1 --> E1[数据结构分析]
    Expert2 --> E2[插件评估]
    Expert3 --> E3[建造策略]
    
    E1 --> Aggregate[Synthesizer Agent]
    E2 --> Aggregate
    E3 --> Aggregate
    
    P3 --> Critic[Critic Agent]
    Aggregate --> Critic
    
    Critic --> Validate{验证通过?}
    Validate -->|否/No| Feedback[反馈修正]
    Feedback --> Expert1
    
    Validate -->|是/Yes| Final[生成最终响应]
    Final --> Output([输出给用户])
    
    style Lead fill:#f96,stroke:#333,stroke-width:3px
    style Aggregate fill:#69f,stroke:#333,stroke-width:3px
    style Critic fill:#f66,stroke:#333,stroke-width:3px
```

### 3.2 智能体状态转换 / Agent State Transition

```mermaid
stateDiagram-v2
    [*] --> IDLE
    
    IDLE --> THINKING: 接收任务
    THINKING --> ACTING: 开始执行
    THINKING --> ERROR: 构建失败
    
    ACTING --> WAITING: 依赖其他智能体
    ACTING --> COMPLETED: 执行成功
    ACTING --> ERROR: 执行失败
    
    WAITING --> ACTING: 依赖完成
    
    COMPLETED --> IDLE: 重置
    ERROR --> IDLE: 重试/重置
    
    note right of THINKING
        构建提示词
        Build prompt
    end note
    
    note right of ACTING
        调用 LLM API
        Call LLM API
    end note
    
    note right of CRITIC
        验证结果
        Validate results
    end note
```

---

## 4. 知识库检索流程
## 4. Knowledge Base Retrieval Flow

### 4.1 检索流程图 / Retrieval Flowchart

```mermaid
graph TB
    Start([用户查询]) --> Preprocess[预处理查询]
    
    Preprocess --> Lower[转小写]
    Lower --> Split[分词]
    Split --> Terms[查询词项集合]
    
    Terms --> LoadIdx[加载 index.json]
    LoadIdx --> Iterate[遍历知识集合]
    
    Iterate --> Match1{关键词匹配?}
    Match1 -->|是/Yes| Score1[score += priority]
    Match1 -->|否/No| Match2
    
    Match2{场景匹配?}
    Match2 -->|是/Yes| Score2[score += priority × 2]
    Match2 -->|否/No| Next
    
    Score1 --> Next{还有集合?}
    Score2 --> Next
    Next -->|是/Yes| Iterate
    Next -->|否/No| Sort
    
    Sort[按分数降序排序] --> Filter{分数 > 0?}
    
    Filter -->|是/Yes| Load[加载知识文件]
    Filter -->|否/No| Empty[返回空结果]
    
    Load --> Inject[注入到 Prompt]
    Inject --> End([返回增强上下文])
    
    style Score2 fill:#ff9,stroke:#333,stroke-width:2px
    style Inject fill:#9f9,stroke:#333,stroke-width:2px
```

### 4.2 检索算法伪代码 / Retrieval Algorithm Pseudocode

```javascript
/**
 * Knowledge Base Retrieval Algorithm
 * 知识库检索算法
 */
function retrieveKnowledge(userQuery, knowledgeIndex) {
  // 1. 预处理 / Preprocess
  const queryTerms = userQuery.toLowerCase().split(/\s+/);
  
  // 2. 初始化结果 / Initialize results
  const results = [];
  
  // 3. 遍历所有知识集合 / Iterate all collections
  for (const collection of knowledgeIndex.collections) {
    let score = 0;
    
    // 3.1 关键词匹配 / Keyword matching
    for (const keyword of collection.keywords) {
      if (queryTerms.some(term => keyword.includes(term))) {
        score += collection.priority;
      }
    }
    
    // 3.2 场景匹配（权重×2）/ Scenario matching (weight ×2)
    for (const scenario of collection.scenarios) {
      if (userQuery.toLowerCase().includes(scenario.toLowerCase())) {
        score += collection.priority * 2;
      }
    }
    
    // 3.3 收集结果 / Collect results
    if (score > 0) {
      results.push({
        collection: collection,
        score: score,
        file: collection.file
      });
    }
  }
  
  // 4. 排序 / Sort
  results.sort((a, b) => b.score - a.score);
  
  // 5. 加载前 N 个知识文件 / Load top N knowledge files
  const topResults = results.slice(0, 3);
  const knowledge = await Promise.all(
    topResults.map(r => loadKnowledgeFile(r.file))
  );
  
  // 6. 返回 / Return
  return {
    results: topResults,
    knowledge: knowledge
  };
}
```

---

## 5. 状态管理流程
## 5. State Management Flow

### 5.1 全局状态流转 / Global State Flow

```mermaid
graph LR
    A[用户操作] --> B[UIController]
    B --> C[EventBus.emit]
    C --> D[AppStateStore.setState]
    D --> E[通知监听器]
    E --> F[UI 更新]
    F --> G[重新渲染]
    
    C --> H[SessionRuntime]
    H --> I[状态机转换]
    I --> J[执行业务逻辑]
    J --> K[EventBus.emit]
    K --> E
    
    style D fill:#f9f,stroke:#333,stroke-width:3px
    style I fill:#9f9,stroke:#333,stroke-width:3px
```

### 5.2 会话状态机 / Session State Machine

```mermaid
stateDiagram-v2
    [*] --> IDLE
    
    IDLE --> ROUTING: 用户输入
    ROUTING --> PLANNING: 意图确定
    PLANNING --> RESEARCHING: 工作流确定
    RESEARCHING --> SPAWNING: 知识检索完成
    SPAWNING --> RUNNING: 智能体创建完成
    RUNNING --> AGGREGATING: 所有智能体完成
    AGGREGATING --> CRITIQUING: 结果聚合
    CRITIQUING --> RESPONDING: 验证通过
    RESPONDING --> IDLE: 返回响应
    
    ROUTING --> ERROR: 路由失败
    PLANNING --> ERROR: 规划失败
    RUNNING --> ERROR: 执行失败
    CRITIQUING --> RUNNING: 验证失败,重新执行
    
    ERROR --> IDLE: 错误处理
    
    note right of ROUTING
        分析用户意图
        Analyze intent
    end note
    
    note right of RUNNING
        多智能体并行
        Multi-agent parallel
    end note
    
    note right of CRITIQUING
        自我审查
        Self-review
    end note
```

---

## 6. API 请求流程
## 6. API Request Flow

### 6.1 请求链路 / Request Chain

```mermaid
graph LR
    A[前端浏览器] -->|1. fetch| B[本地 PHP 代理]
    B -->|2. 验证请求| C[chat.php]
    C -->|3. 读取密钥| D[secrets.local.php]
    C -->|4. 转发请求| E[DeepSeek API]
    E -->|5. 返回响应| C
    C -->|6. 格式化| C
    C -->|7. 返回| A
    
    style B fill:#ff9,stroke:#333,stroke-width:2px
    style E fill:#9f9,stroke:#333,stroke-width:2px
```

### 6.2 请求处理时序 / Request Processing Sequence

```mermaid
sequenceDiagram
    participant FE as 前端
    participant Proxy as PHP 代理
    participant API as DeepSeek API
    
    FE->>Proxy: POST /api/chat.php
    activate Proxy
    
    Proxy->>Proxy: 验证请求格式
    Proxy->>Proxy: 读取 API 密钥
    
    Proxy->>API: POST /v1/chat/completions
    activate API
    
    Note over API: 推理处理<br/>2-5 秒
    
    API-->>Proxy: 响应数据
    deactivate API
    
    Proxy->>Proxy: 格式化响应
    Proxy-->>FE: {success: true, data: {...}}
    deactivate Proxy
```

---

## 7. 错误处理流程
## 7. Error Handling Flow

```mermaid
graph TB
    Error{错误发生} --> Type{错误类型?}
    
    Type -->|网络错误| Network[网络错误处理]
    Type -->|API 错误| APIErr[API 错误处理]
    Type -->|业务错误| BizErr[业务错误处理]
    
    Network --> Retry{可重试?}
    Retry -->|是/Yes| Wait[等待重试]
    Retry -->|否/No| NetFail[网络错误提示]
    
    Wait --> RetryCount{重试次数 < 3?}
    RetryCount -->|是/Yes| Retry
    RetryCount -->|否/No| NetFail
    
    APIErr --> Status{HTTP 状态码}
    Status -->|4xx| ClientErr[客户端错误]
    Status -->|5xx| ServerErr[服务器错误]
    
    ClientErr --> LogErr[记录错误]
    ServerErr --> LogErr
    
    BizErr --> Validate{验证错误}
    Validate --> LogErr
    
    LogErr --> Notify[EventBus.emit error]
    Notify --> UI[UI 显示错误]
    UI --> End([结束])
    
    NetFail --> End
```

---

**最后更新 / Last Updated**: 2026-04-10
