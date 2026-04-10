/**
 * Constants - 常量定义
 * Constants Definition
 * 
 * ============================================================
 * 架构说明 / Architecture Notes:
 * - 集中管理所有枚举常量，避免魔法字符串
 * - 提高代码可读性和可维护性
 * - 便于 IDE 自动补全和类型检查
 * 
 * Centralized management of all enum constants, avoiding magic strings
 * Improves code readability and maintainability
 * Facilitates IDE autocomplete and type checking
 * ============================================================
 */

/**
 * RuntimeState - 运行时状态枚举
 * Runtime State Enumeration
 * 
 * 描述会话的完整生命周期状态
 * Describes complete lifecycle states of a session
 * 
 * 状态转换图 / State Transition Diagram:
 * ```
 * IDLE → ROUTING → PLANNING → RESEARCHING → SPAWNING_AGENTS 
 *   → AGENT_RUNNING → AGGREGATING → SELF_CRITIQUING → RESPONDING → IDLE
 *                                              ↓
 *                                           ERROR
 * ```
 */
const RuntimeState = {
  /** 空闲状态，等待用户输入 / Idle, waiting for user input */
  IDLE: 'idle',
  
  /** 意图路由中，分析用户需求 / Routing intent, analyzing user requirements */
  ROUTING: 'routing',
  
  /** 规划工作流，制定执行策略 / Planning workflow, developing execution strategy */
  PLANNING: 'planning',
  
  /** 知识检索中，查询知识库 / Researching, querying knowledge base */
  RESEARCHING: 'researching',
  
  /** 生成智能体，创建专家实例 / Spawning agents, creating expert instances */
  SPAWNING_AGENTS: 'spawning',
  
  /** 智能体执行中，并行或串行处理 / Agents running, parallel or sequential processing */
  AGENT_RUNNING: 'running',
  
  /** 聚合结果，整合各专家输出 / Aggregating results, integrating expert outputs */
  AGGREGATING: 'aggregating',
  
  /** 自我批判，验证和优化结果 / Self-critiquing, validating and optimizing results */
  SELF_CRITIQUING: 'critiquing',
  
  /** 总结上下文，准备响应 / Summarizing context, preparing response */
  SUMMARIZING_CONTEXT: 'summarizing',
  
  /** 返回响应给用户 / Responding to user */
  RESPONDING: 'responding',
  
  /** 错误状态，处理异常 / Error state, handling exceptions */
  ERROR: 'error',
  
  /** 暂停状态，用户中断 / Paused, user interrupted */
  PAUSED: 'paused'
};

/**
 * WorkflowType - 工作流类型枚举
 * Workflow Type Enumeration
 * 
 * 描述系统支持的不同工作流策略
 * Describes different workflow strategies supported by the system
 * 
 * 选择策略 / Selection Strategy:
 * - Simple: 单轮对话，无需复杂推理
 * - ReAct: 需要工具调用的多轮推理
 * - Swarm: 多专家并行执行
 * - Research: 深度研究和综合分析
 * - Code: 代码生成和验证
 */
const WorkflowType = {
  /** 
   * 简单回答工作流
   * Simple answer workflow
   * 
   * 适用场景 / Use Cases:
   - 概念解释 / Concept explanation
   - 简单操作指导 / Simple operation guidance
   - 快速问答 / Quick Q&A
   */
  SIMPLE: 'simple_answer',
  
  /**
   * ReAct 工具循环工作流
   * ReAct (Reasoning + Acting) tool loop workflow
   * 
   * 特点 / Characteristics:
   - 思考 → 行动 → 观察 → 思考循环
   - Think → Act → Observe → Think cycle
   - 适合需要多步推理和工具调用的任务
   */
  REACT: 'react_tool_loop',
  
  /**
   * 多智能体集群工作流
   * Multi-agent swarm workflow
   * 
   * 特点 / Characteristics:
   - 多个专家智能体并行执行
   - Multiple expert agents execute in parallel
   - 通过 JIT 编译实现 O(1) 复杂度
   */
  SWARM: 'multi_agent_swarm',
  
  /**
   * 研究综合工作流
   * Research synthesis workflow
   * 
   * 特点 / Characteristics:
   - 深度知识检索和综合分析
   - Deep knowledge retrieval and comprehensive analysis
   - 适合复杂技术问题的深度解答
   */
  RESEARCH: 'research_synthesis',
  
  /**
   * 代码生成工作流
   * Code generation workflow
   * 
   * 特点 / Characteristics:
   - 生成 C#/Python 脚本
   - Generate C#/Python scripts
   - 包含语法验证和优化建议
   */
  CODE: 'code_generation',
  
  /**
   * 深度方法审查工作流
   * Deep methodology review workflow
   * 
   * 特点 / Characteristics:
   - 针对算法架构的深度分析
   - Deep analysis for algorithm architecture
   - 多方案对比和性能评估
   */
  METHODOLOGY: 'deep_methodology_review'
};

/**
 * AgentRole - 智能体角色枚举
 * Agent Role Enumeration
 * 
 * 定义系统中的 11 种专家角色
 * Defines 11 expert roles in the system
 * 
 * 分层架构 / Layered Architecture:
 * - 调度层 (1): Lead
 * - 专家层 (6): Methodology, Plugin, Script, Node, DataTree, Fabrication
 * - 辅助层 (4): Research, KB_Recall, Critic, Synthesizer
 */
const AgentRole = {
  /**
   * 主调度智能体 🎯
   * Lead Agent
   * 
   * 职责 / Responsibilities:
   - 分析用户意图 / Analyze user intent
   - 制定执行计划 / Create execution plan
   - 协调专家智能体 / Coordinate expert agents
   - 聚合最终结果 / Aggregate final results
   */
  LEAD: 'lead',
  
  /**
   * 方法架构专家 🏗️
   * Methodology Expert
   * 
   * 职责 / Responsibilities:
   - 宏观算法架构设计 / Macro algorithm architecture design
   - 数学严谨性评估 / Mathematical rigor evaluation
   - 多方案对比分析 / Multi-solution comparative analysis
   */
  METHODOLOGY: 'methodology',
  
  /**
   * 算法生态专家 🔌
   * Plugin Ecosystem Expert
   * 
   * 职责 / Responsibilities:
   - 第三方插件评估 / Third-party plugin evaluation
   - 原生降级方案设计 / Native degradation alternative design
   - 依赖关系分析 / Dependency analysis
   */
  PLUGIN: 'plugin',
  
  /**
   * 语法编程专家 💻
   * Script Programming Expert
   * 
   * 职责 / Responsibilities:
   - C#/Python 脚本生成 / C#/Python script generation
   - Type Hint 规范 / Type Hint specification
   - List/Tree 接口处理 / List/Tree interface handling
   */
  SCRIPT: 'script',
  
  /**
   * 组件推演专家 🔧
   * Component Deduction Expert
   * 
   * 职责 / Responsibilities:
   - GH 组件名称校验 / GH component name validation
   - 面板位置确认 / Panel location confirmation
   - 连线拓扑验证 / Wiring topology verification
   - 防幻觉机制核心 / Core anti-hallucination mechanism
   */
  NODE: 'node',
  
  /**
   * 数据拓扑专家 🌳
   * Data Topology Expert
   * 
   * 职责 / Responsibilities:
   - Data Tree 结构分析 / Data Tree structure analysis
   - Graft/Flatten/Simplify 操作建议 / Operation suggestions
   - 数据匹配验证 / Data matching validation
   - 层级深度预测 / Hierarchy depth prediction
   */
  DATATREE: 'datatree',
  
  /**
   * 建造理化专家 🏭
   * Fabrication Expert
   * 
   * 职责 / Responsibilities:
   - 几何降阶策略 / Geometric order reduction strategy
   - 有理化分析 / Rationalization analysis
   - 公差控制 / Tolerance control
   - 数控加工优化 / CNC machining optimization
   */
  FABRICATION: 'fabrication',
  
  /**
   * 研究智能体 🔍
   * Research Agent
   * 
   * 职责 / Responsibilities:
   - 深度知识检索 / Deep knowledge retrieval
   - 文献综述 / Literature review
   - 技术趋势分析 / Technology trend analysis
   */
  RESEARCH: 'research',
  
  /**
   * 知识库召回智能体 📚
   * Knowledge Base Recall Agent
   * 
   * 职责 / Responsibilities:
   - 关键词匹配 / Keyword matching
   - 场景检索 / Scenario retrieval
   - 知识注入 / Knowledge injection
   */
  KB_RECALL: 'kb_recall',
  
  /**
   * 批判智能体 🔎
   * Critic Agent
   * 
   * 职责 / Responsibilities:
   - 结果验证 / Result validation
   - 逻辑审查 / Logic review
   - 错误检测 / Error detection
   - 质量评估 / Quality assessment
   */
  CRITIC: 'critic',
  
  /**
   * 综合智能体 🧩
   * Synthesizer Agent
   * 
   * 职责 / Responsibilities:
   - 多专家结果整合 / Multi-expert result integration
   - 冲突解决 / Conflict resolution
   - 最终输出优化 / Final output optimization
   */
  SYNTHESIZER: 'synthesizer'
};

/**
 * AgentStatus - 智能体状态枚举
 * Agent Status Enumeration
 * 
 * 描述智能体的执行状态
 * Describes agent execution states
 * 
 * 状态机 / State Machine:
 * ```
 * IDLE → THINKING → ACTING → COMPLETED
 *   ↓        ↓         ↓
 * ERROR   WAITING   ERROR
 * ```
 */
const AgentStatus = {
  /** 空闲状态，等待任务分配 / Idle, waiting for task assignment */
  IDLE: 'idle',
  
  /** 思考中，分析任务 / Thinking, analyzing task */
  THINKING: 'thinking',
  
  /** 执行中，调用 API 或处理数据 / Acting, calling API or processing data */
  ACTING: 'acting',
  
  /** 等待中，依赖其他智能体 / Waiting, depending on other agents */
  WAITING: 'waiting',
  
  /** 已完成，返回结果 / Completed, returned results */
  COMPLETED: 'completed',
  
  /** 错误，执行失败 / Error, execution failed */
  ERROR: 'error'
};

/**
 * 导出所有常量
 * Export all constants
 * 
 * 使用方式 / Usage:
 * ```javascript
 * import { RuntimeState, AgentRole } from './constants.js';
 * 
 * if (state === RuntimeState.IDLE) {
 *   // ...
 * }
 * ```
 */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    RuntimeState,
    WorkflowType,
    AgentRole,
    AgentStatus
  };
}
