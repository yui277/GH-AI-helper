# 🦗 GH Helper（小壁蜂OsmiaAI）: 基于动态多维并发路由的参数化协同矩阵
# GH Helper (OsmiaAI): Parametric Collaborative Matrix Based on Dynamic Multi-dimensional Routing Concurrent Orchestration

**版本 / Version**: 0.3.8-beta
**发布日期 / Release Date**: 2026-04-27  
**开发者 / Developer**: cf (lichengfu2003)  
**技术架构 / Architecture**: DeepSeek V4 Pro & JIT Prompt-Level MoE

---

## 📋 项目简介 / Project Overview

### 中文
传统的单体大模型在面对高度结构化、严谨度极高的 Grasshopper (GH) 节点化编程时，往往会陷入"捏造运算器（幻觉）"和"数据拓扑（Data Tree）塌陷"的泥沼。

**GH Helper（小壁蜂OsmiaAI）** 并非一个简单的"套壳对话框"，而是一个在纯前端环境实现的**原生多代理推理编译引擎 (Native Multi-Agent Inference Compiler)**。本项目深度借鉴 **Grok 4.20** 的混合专家池 (MoE) 与内部辩论机制，重构了针对工业级参数化设计的 AI 协同计算范式。

**在线体验 / Live Demo**: https://topogenesis.top/intro/ghhelper

**GitHub 仓库 / GitHub Repository**: https://github.com/yui277/GH-AI-helper

**English**:
**GH Helper (OsmiaAI)** is not a simple "wrapper dialog box", but a **Native Multi-Agent Inference Compiler** implemented in a pure frontend environment. This project deeply draws on **Grok 4.20**'s Mixture of Experts (MoE) and internal debate mechanism, reconstructing the AI collaborative computing paradigm for industrial-grade parametric design.

**Live Demo**: https://topogenesis.top/intro/ghhelper

---

## 发布边界 / Release Boundary

本仓库是公开发布仓库，只包含脱敏后的技术文档、架构说明和 `src/` 下的抽象化代码骨架。`GH_helper_super0.3.8` 的完整工程源文件、后端代理实现、运行数据库、知识库 JSON、运行缓存、用户数据和任何 API key 都不应直接发布到 GitHub。

This public repository contains only sanitized documentation, architecture notes, and abstracted code skeletons under `src/`. Full engineering source files, backend proxy implementations, runtime databases, knowledge-base JSON, caches, user data, and API keys must not be published here.

发布规则见 [RELEASE-POLICY.md](./RELEASE-POLICY.md)，安全说明见 [SECURITY.md](./SECURITY.md)。

---

## 🆕 0.3.8-beta 更新内容 / 0.3.8-beta Changelog

### 🎨 UI 重大重构 / Major UI Redesign
- **ChatGPT 风格侧边栏 + 主对话界面布局**：电脑端全面采用侧边栏 (280px) + 主对话区域的新布局，将设置、导航、对话历史等全部整合至左侧侧边栏，右侧主区域完整铺满作为对话界面
- **ChatGPT-style Sidebar + Main Area Layout**: Desktop interface now features a sidebar (280px) + main dialogue area, integrating all settings, navigation, and conversation history into the left sidebar

### 💭 Think 模式三档切换 / Three-Mode Think Toggle
- **Think Max**（默认）：启用深度推理，reasoning_effort=max，最高质量的思维链推演
- **Non-Think · 精确**：禁用推理，temperature=0.1 / top_p=0.1，严谨精确的技术应答
- **Non-Think · 发散**：禁用推理，temperature=0.7 / top_p=0.7，创意发散式探索
- 模式选择自动持久化至 localStorage，切换时即时更新系统提示词

### 🔧 工程修复 / Engineering Fixes
- **历史加载面板重建**：加载对话历史时自动重建 Wiring 连线和 Code 代码面板，不再丢失结构化渲染内容
- **意大利语翻译补全**：修复 `sysMsgSearching` 和 `detailSummary` 字段的意大利语翻译
- **max_tokens 对齐**：前端 (64096) 与后端默认值统一
- **Thinking 模式参数清理**：Thinking 启用时不再向后端发送无效的 temperature/top_p 参数

### 🔒 安全加固 / Security Hardening
- **密码哈希升级**：MD5 → bcrypt (`password_hash` / `password_verify`)
- **Token 安全**：弱 Token (`base64(user_id:time:salt)`) → 随机 64 位十六进制 Token + 数据库存储 + 30 天过期
- **API 参数校验**：thinking 模式下自动过滤不兼容参数

### 🧠 架构改进 / Architecture Improvements
- **SwarmWorkflow 动态任务分解**：`decomposeTasks()` 从硬编码 4 个任务 → 基于 LeadAgent 计划动态生成
- **selfCritique 兼容性**：兼容多种 `improvedVersion`/`improvedAnswer` 字段名，增加 JSON 解析失败降级处理
- **AgentFactory 完整覆盖**：从仅区分 LEAD/CRITIC/其他 → 为全部 11 个 AgentRole 提供专门的 specialty 配置

---

## 🧬 核心架构特性 / Core Architecture Features

### 1. 动态多模态意图路由 / Dynamic Multi-modal Intent Routing

**中文**: 我们将单一的系统认知空间，正交切分为 7 个极度垂直的专业人格路由节点（Agent Heads）。系统通过前端 UI 的路由阵列主动拦截用户意图，并在底层锚定不同的注意力权重。

**English**: We orthogonally divide the single system cognitive space into 7 extremely vertical professional personality routing nodes (Agent Heads). The system proactively intercepts user intent through the frontend UI routing array and anchors different attention weights at the底层 level.

**七大专家路由 / Seven Expert Routing Nodes**:
- **方法架构 / Methodology**: 统筹宏观生成逻辑（涌现、元胞自动机、分形等）/ Coordinate macro generation logic (emergence, cellular automata, fractals, etc.)
- **算法生态 / Plugins**: 专注第三方库的生态调用与原生降级替代评估 / Focus on third-party library ecosystem invocation and native degradation alternative evaluation
- **语法编程 / Scripts**: 严格约束 C#/Python 脚本植入、Type Hint 及 List/Tree 接口环境 / Strictly constrain C#/Python script implantation, Type Hint and List/Tree interface environment
- **组件推演 / Nodes**: 最严苛的"防幻觉"路由，严格校验原生电池名称、所在面板及底层连线拓扑 / The most stringent "anti-hallucination" routing, strictly verify native battery names, panels and underlying wiring topology
- **数据拓扑 / Data Topology**: 专职应对 GH 的灵魂——Data Tree，精准预测 Graft / Flatten / Simplify 介入点 / Dedicated to GH's soul - Data Tree, accurately predict Graft / Flatten / Simplify intervention points
- **建造理化 / Fabrication**: 面向幕墙嵌板、数控加工的几何降阶、有理化与公差控制策略 / Geometric order reduction, rationalization and tolerance control strategies for curtain wall paneling and CNC machining
- **联网搜索 / Web Search**: 全网检索最新参数化设计资讯与案例 / Web-wide retrieval of latest parametric design information and cases

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
- **UI 布局 / UI Layout**: ChatGPT 风格侧边栏 + 主对话区域 / ChatGPT-style Sidebar + Main Area

### 后端 / Backend
- **服务器语言 / Server Language**: PHP 7.4+
- **数据库 / Database**: SQLite (WAL 模式)
- **API 架构 / API Architecture**: RESTful + 代理模式 / RESTful + Proxy Pattern
- **安全 / Security**: bcrypt 密码哈希 + 数据库存储随机 Token / bcrypt password hash + DB-stored random tokens

### AI / AI
- **主模型 / Main Model**: DeepSeek V4 Pro
- **推理机制 / Inference Mechanism**: Chain-of-Thought (CoT) + 内部辩论 / Internal Debate
- **Prompt 工程 / Prompt Engineering**: JIT 动态编译 + 多专家矩阵 / JIT Dynamic Compilation + Multi-Expert Matrix
- **Think 模式 / Think Modes**: Think Max / Non-Think Precise / Non-Think Creative

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
│   ├── workflows.js              # 工作流引擎：WorkflowEngine, SwarmWorkflow
│   ├── app.js                    # 应用层：UIController, 主逻辑
│   ├── runtime.js                # 运行时：ContextWindow, Memory, TokenBudget
│   ├── code-panel.js             # 代码面板渲染器 / Code panel renderer
│   └── wiring-panel.js           # 连线面板渲染器 / Wiring panel renderer
│
├── knowledge/                    # 知识库 / Knowledge Base
│   ├── index.json                # 知识库索引 (0.3.8-beta-kb4)
│   ├── native/                   # 原生组件知识 / Native components knowledge
│   │   ├── gh_params_input.json        # 输入与参数控制
│   │   ├── gh_math_sets_tree.json      # 数学、集合与数据树
│   │   ├── gh_curve_surface_solid.json # 曲线、曲面与实体
│   │   ├── gh_transform_intersect_analysis.json # 变换、相交与分析
│   │   └── gh_mesh_fabrication.json    # 网格与建造理化
│   ├── plugin/                   # 插件知识 / Plugin knowledge
│   │   ├── gh_kangaroo.json            # Kangaroo
│   │   ├── gh_weaverbird.json          # WeaverBird
│   │   ├── gh_lunchbox_panelingtools_opennest.json
│   │   ├── gh_plugin_heteroptera_bifocals.json
│   │   ├── gh_plugin_human.json
│   │   ├── gh_plugin_ladybug.json
│   │   └── gh_plugin_pufferfish.json
│   └── collections/              # 工作流知识 / Workflow collections
│       ├── gh_workflow_panelization.json   # 面板化设计
│       ├── gh_workflow_datadriven.json     # 数据驱动
│       ├── gh_workflow_fabrication.json    # 建造理化
│       ├── gh_workflow_facade.json         # 幕墙设计
│       └── gh_workflow_formfinding.json    # 形态寻找
│
└── bak/                          # 历史版本备份 / Historical version backup
```

---

## 🚀 快速开始 / Quick Start

### 本地部署 / Local Deployment

以下说明描述私有工程的部署形态；公开 GitHub 仓库不包含可直接部署的完整工程文件。

The following notes describe the private engineering deployment shape. The public GitHub repository does not contain a directly deployable full source package.

**中文**:
1. 确保服务器支持 PHP 7.4+ 和 SQLite
2. 将项目文件部署到 Web 服务器目录
3. 配置 `api/secrets.local.php` 中的 API 密钥（建议使用环境变量）
4. 访问 `GH_helper_super.html` 即可使用

**English**:
1. Ensure server supports PHP 7.4+ and SQLite
2. Deploy project files to Web server directory
3. Configure API key in `api/secrets.local.php` (environment variables recommended)
4. Access `GH_helper_super.html` to use

---

## 📊 架构核心指标 / Core Architecture Metrics

| 指标 / Metric | 数值 / Value | 说明 / Description |
|--------------|-------------|-------------------|
| 专家路由数量 / Expert Routing Nodes | 7 | 正交切分的专业人格 / Orthogonally divided professional personalities |
| 智能体角色 / Agent Roles | 11 | 包含调度、专家、审查、合成等角色 / Including dispatch, expert, review, synthesis roles |
| 工作流类型 / Workflow Types | 6 | Simple, ReAct, Swarm, Research, Code, Methodology |
| Think 模式 / Think Modes | 3 | Think Max / Non-Think Precise / Non-Think Creative |
| API 调用复杂度 / API Call Complexity | O(1) | 单次请求完成多专家协同 / Single request completes multi-expert collaboration |
| JIT 编译时间 / JIT Compilation Time | <10ms | 毫秒级系统提示生成 / Millisecond-level system prompt generation |
| 防幻觉机制 / Anti-Hallucination Mechanisms | 3 层 / Layers | 注意力锚定 + 对抗辩论 + 结构化输出 / Attention Anchoring + Adversarial Debate + Structured Output |
| UI 支持语言 / UI Languages | 3 | 中文 / English / Italiano |

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

**中文**: 本项目仅供技术介绍和架构参考，禁止用于商业用途。

**English**: This project is for technical introduction and architecture reference only. Commercial use is prohibited.

---

**Developed by cf (lichengfu2003) | Powered by DeepSeek V4 Pro & JIT Prompt-Level MoE Architecture**
