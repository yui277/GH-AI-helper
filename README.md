# 🦗 GH Helper（小壁蜂OsmiaAI）: 基于动态多维并发路由的参数化协同矩阵
# GH Helper (OsmiaAI): Parametric Collaborative Matrix Based on Dynamic Multi-dimensional Routing Concurrent Orchestration

**版本 / Version**: v0.3.6-beta  
**开发者 / Developer**: cf (lichengfu2003)  
**技术架构 / Architecture**: DeepSeek-Reasoner & JIT Prompt-Level MoE

---

## 📋 项目简介 / Project Overview

### 中文
传统的单体大模型在面对高度结构化、严谨度极高的 Grasshopper (GH) 节点化编程时，往往会陷入"捏造运算器（幻觉）"和"数据拓扑（Data Tree）塌陷"的泥沼。

**GH Helper（小壁蜂OsmiaAI）** 并非一个简单的"套壳对话框"，而是一个在纯前端环境实现的**原生多代理推理编译引擎 (Native Multi-Agent Inference Compiler)**。本项目深度借鉴 **Grok 4.20** 的混合专家池 (MoE) 与内部辩论机制，重构了针对工业级参数化设计的 AI 协同计算范式。

**在线体验 / Live Demo**: https://topogenesis.top/intro/ghhelper

**English**:
**GH Helper (OsmiaAI)** is not a simple "wrapper dialog box", but a **Native Multi-Agent Inference Compiler** implemented in a pure frontend environment. This project deeply draws on **Grok 4.20**'s Mixture of Experts (MoE) and internal debate mechanism, reconstructing the AI collaborative computing paradigm for industrial-grade parametric design.

**Live Demo**: https://topogenesis.top/intro/ghhelper

---

## 🧬 核心架构特性 / Core Architecture Features

### 1. 动态多模态意图路由 / Dynamic Multi-modal Intent Routing

**中文**: 我们将单一的系统认知空间，正交切分为 6 个极度垂直的专业人格路由节点（Agent Heads）。系统通过前端 UI 的路由阵列主动拦截用户意图，并在底层锚定不同的注意力权重。

**English**: We orthogonally divide the single system cognitive space into 6 extremely vertical professional personality routing nodes (Agent Heads). The system proactively intercepts user intent through the frontend UI routing array and anchors different attention weights at the底层 level.

**六大专家路由 / Six Expert Routing Nodes**:
- **方法架构 / Methodology**: 统筹宏观生成逻辑（涌现、元胞自动机、分形等）/ Coordinate macro generation logic (emergence, cellular automata, fractals, etc.)
- **算法生态 / Plugins**: 专注第三方库的生态调用与原生降级替代评估 / Focus on third-party library ecosystem invocation and native degradation alternative evaluation
- **语法编程 / Scripts**: 严格约束 C#/Python 脚本植入、Type Hint 及 List/Tree 接口环境 / Strictly constrain C#/Python script implantation, Type Hint and List/Tree interface environment
- **组件推演 / Nodes**: 最严苛的"防幻觉"路由，严格校验原生电池名称、所在面板及底层连线拓扑 / The most stringent "anti-hallucination" routing, strictly verify native battery names, panels and underlying wiring topology
- **数据拓扑 / Data Topology**: 专职应对 GH 的灵魂——Data Tree，精准预测 Graft / Flatten / Simplify 介入点 / Dedicated to GH's soul - Data Tree, accurately predict Graft / Flatten / Simplify intervention points
- **建造理化 / Fabrication**: 面向幕墙嵌板、数控加工的几何降阶、有理化与公差控制策略 / Geometric order reduction, rationalization and tolerance control strategies for curtain wall paneling and CNC machining

### 2. 多维路由并发编排 / Multi-dimensional Routing Concurrent Orchestration

**中文**: 这是本系统的核心技术壁垒。用户可以在 UI 层无缝进行"多态叠加"（例如并发激活 [数据拓扑] + [算法生态] + [建造理化]）。底层引擎并不发起多次低效的 API 请求，而是执行**并发编排**，在毫秒级内将其**即时编译 (JIT Compilation)** 为一段复合的"超级系统矩阵指令"。

**English**: This is the core technical barrier of this system. Users can seamlessly perform "polymorphic superposition" at the UI layer (e.g., concurrently activate [Data Topology] + [Algorithm Ecology] + [Fabrication]). The underlying engine does not initiate multiple inefficient API requests, but executes **concurrent orchestration**, **JIT compiling** them into a composite "super system matrix instruction" within milliseconds.

**架构优势 / Architecture Advantages**:
- O(1) 网络复杂度 / O(1) network complexity
- 共享 KV-Cache 与单次推理 Pipeline / Shared KV-Cache and single inference Pipeline
- 完美避免多模型通讯导致的上下文丢失 / Perfectly avoid context loss caused by multi-model communication

### 3. JIT Prompt 编译引擎 / JIT Prompt Compilation Engine

**中文**: 当多个意图路由被并发触发时，系统会动态抽提各激活专家的 Roles (角色人格)、Debates (对抗性辩论原则) 和 Outputs (结构化输出约束)，并在毫秒级内即时编译为专属于当前请求的超级上下文。

**English**: When multiple intent routings are concurrently triggered, the system dynamically extracts the Roles, Debates (adversarial debate principles), and Outputs (structured output constraints) of each activated expert, and JIT compiles them into a super context exclusive to the current request within milliseconds.

**编译生命周期 / Compilation Lifecycle**:
```
场景构建 → 人格注入 → 对抗规则声明 → 输出格式钳制
Scene Construction → Personality Injection → Adversarial Rule Declaration → Output Format Clamping
```

### 4. 注意力锚定机制 / Attention Anchoring Mechanism

**中文**: 通过在 JIT 编译的系统指令中密集注入对抗性约束，我们利用了注意力锚定原理——强迫大模型在计算 Attention Matrix（注意力矩阵）时，为这些"查错与对抗"的 Token 分配绝对高权重，从而从根本上遏制了深度网络在长程推理中的注意力漂移。

**English**: By densely injecting adversarial constraints into the JIT compiled system instructions, we utilize the Attention Anchoring principle - forcing the large model to assign absolute high weights to these "error-checking and adversarial" Tokens when calculating the Attention Matrix, thereby fundamentally curbing attention drift in deep networks during long-range inference.

---

## 🛠️ 技术栈 / Tech Stack

### 前端 / Frontend
- **核心语言 / Core Language**: JavaScript (ES6+)
- **渲染引擎 / Rendering Engine**: SVG Canvas (Grasshopper 风格连线面板)
- **Markdown 解析 / Markdown Parsing**: marked.js
- **架构模式 / Architecture Pattern**: 事件总线 + 状态机 + 工厂模式 / Event Bus + State Machine + Factory Pattern

### 后端 / Backend
- **服务器语言 / Server Language**: PHP 7.4+
- **数据库 / Database**: SQLite (WAL 模式)
- **API 架构 / API Architecture**: RESTful + 代理模式 / RESTful + Proxy Pattern

### AI / AI
- **主模型 / Main Model**: DeepSeek-Reasoner
- **推理机制 / Inference Mechanism**: Chain-of-Thought (CoT) + 内部辩论 / Internal Debate
- **Prompt 工程 / Prompt Engineering**: JIT 动态编译 + 多专家矩阵 / JIT Dynamic Compilation + Multi-Expert Matrix

---

## 📁 目录结构 / Directory Structure

```
GH Helper (OsmiaAI) Super/
├── GH_helper_super.html          # 主界面入口 / Main interface entry
├── webbase.css                   # 基础样式定义 / Base style definitions
├── webbase.js                    # 基础交互逻辑 / Base interaction logic
├── gha_api.php                   # 后端 API 代理 / Backend API proxy
├── gh_data.db                    # SQLite 数据库 / SQLite database
│
├── api/                          # API 端点目录 / API endpoints directory
│   ├── chat.php                  # 聊天接口 / Chat endpoint
│   ├── common.php                # 公共函数库 / Common functions library
│   └── secrets.local.php         # 密钥配置（已移除）/ Secret configuration (removed)
│
├── js/                           # JavaScript 模块 / JavaScript modules
│   ├── core.js                   # 核心内核：EventBus, StateStore, Constants
│   ├── services.js               # 服务层：LLMGateway, KnowledgeBase, Search
│   ├── agents.js                 # 智能体系统：Agent, LeadAgent, SpecialistAgent
│   ├── workflows.js              # 工作流引擎：WorkflowEngine
│   ├── app.js                    # 应用层：UIController, 主逻辑
│   ├── code-panel.js             # 代码面板渲染器 / Code panel renderer
│   └── wiring-panel.js           # 连线面板渲染器 / Wiring panel renderer
│
├── knowledge/                    # 知识库 / Knowledge Base
│   ├── index.json                # 知识库索引 / Knowledge base index
│   ├── native/                   # 原生组件知识 / Native components knowledge
│   └── plugin/                   # 插件知识 / Plugin knowledge
│
└── bak/                          # 历史版本备份 / Historical version backup
```

---

## 🚀 快速开始 / Quick Start

### 本地部署 / Local Deployment

**中文**:
1. 确保服务器支持 PHP 7.4+ 和 SQLite
2. 将项目文件部署到 Web 服务器目录
3. 配置 `api/secrets.local.php` 中的 API 密钥
4. 访问 `GH_helper_super.html` 即可使用

**English**:
1. Ensure server supports PHP 7.4+ and SQLite
2. Deploy project files to Web server directory
3. Configure API key in `api/secrets.local.php`
4. Access `GH_helper_super.html` to use

### 技术学习 / Technical Learning

**中文**: 本项目的技术架构文档和代码骨架位于 `Github发布/260410` 目录，包含：
- 完整的技术架构文档（中英双语）
- 抽象化的代码骨架（适合学习设计模式）
- 详细的架构白皮书

**English**: The technical architecture documentation and code skeleton of this project are located in the `Github发布/260410` directory, including:
- Complete technical architecture documentation (bilingual)
- Abstracted code skeleton (suitable for learning design patterns)
- Detailed architecture whitepaper

---

## 📊 架构核心指标 / Core Architecture Metrics

| 指标 / Metric | 数值 / Value | 说明 / Description |
|--------------|-------------|-------------------|
| 专家路由数量 / Expert Routing Nodes | 6 | 正交切分的专业人格 / Orthogonally divided professional personalities |
| 智能体角色 / Agent Roles | 11 | 包含调度、专家、审查等角色 / Including dispatch, expert, review roles |
| 工作流类型 / Workflow Types | 5 | Simple, ReAct, Swarm, Research, Code |
| API 调用复杂度 / API Call Complexity | O(1) | 单次请求完成多专家协同 / Single request completes multi-expert collaboration |
| JIT 编译时间 / JIT Compilation Time | <10ms | 毫秒级系统提示生成 / Millisecond-level system prompt generation |
| 防幻觉机制 / Anti-Hallucination Mechanisms | 3 层 / Layers | 注意力锚定 + 对抗辩论 + 结构化输出 / Attention Anchoring + Adversarial Debate + Structured Output |

---

## 📖 更多文档 / More Documentation

- **架构白皮书 / Architecture Whitepaper**: [Architecture-Whitepaper-CN-EN.md](./Architecture-Whitepaper-CN-EN.md)
- **API 参考文档 / API Reference**: [API-REFERENCE.md](./API-REFERENCE.md)
- **模块架构说明 / Module Architecture**: [MODULES.md](./MODULES.md)
- **数据流图 / Data Flow Diagram**: [DATA-FLOW.md](./DATA-FLOW.md)
- **部署指南 / Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **扩展开发指南 / Extension Guide**: [EXTENSION-GUIDE.md](./EXTENSION-GUIDE.md)

---

## 📝 开源协议 / License

**中文**: 本项目仅供技术学习和架构参考，禁止用于商业用途。

**English**: This project is for technical learning and architecture reference only. Commercial use is prohibited.

---

**Developed by cf (lichengfu2003) | Powered by DeepSeek-Reasoner & JIT Prompt-Level MoE Architecture**
