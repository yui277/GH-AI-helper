/**
 * Agent Base Class - 智能体基类
 * 
 * ============================================================
 * 设计模式: 模板方法模式 (Template Method Pattern)
 * 用途: 定义智能体的通用行为，子类实现具体逻辑
 * 
 * 架构说明 / Architecture Notes:
 * - 所有专家智能体的抽象基类
 * - 定义标准接口和执行流程
 * - 子类重写 buildPrompt() 和 getSystemPrompt() 实现专业化
 * 
 * 继承层次 / Inheritance Hierarchy:
 * Agent (基类)
 *   ├── LeadAgent (主调度智能体)
 *   └── SpecialistAgent (专家智能体)
 *         ├── MethodologyAgent
 *         ├── PluginAgent
 *         ├── ScriptAgent
 *         ├── NodeAgent
 *         ├── DataTreeAgent
 *         └── FabricationAgent
 * ============================================================
 */

class Agent {
  /**
   * 构造函数 / Constructor
   * 
   * @param {string} role - 智能体角色 / Agent role
   *                        参考 AgentRole 常量 / Refer to AgentRole constants
   * @param {LLMGateway} llmGateway - LLM 网关实例 / LLM gateway instance
   * @param {EventBus} eventBus - 事件总线实例 / Event bus instance
   */
  constructor(role, llmGateway, eventBus) {
    /** 智能体角色 / Agent role */
    this.role = role;
    
    /** LLM 网关，用于 API 调用 / LLM gateway for API calls */
    this.llmGateway = llmGateway;
    
    /** 事件总线，用于状态广播 / Event bus for state broadcasting */
    this.eventBus = eventBus;
    
    /** 当前状态 / Current state */
    this.status = AgentStatus.IDLE;
    
    /** 执行历史 / Execution history */
    this.history = [];
  }

  /**
   * 获取角色图标
   * Get role icon
   * 
   * @returns {string} - Emoji 图标 / Emoji icon
   * 
   * 用途: UI 展示 / Purpose: UI display
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
   * 
   * @param {string} status - 新状态 / New state
   *                           参考 AgentStatus 常量 / Refer to AgentStatus constants
   * 
   * 架构价值 / Architecture Value:
   * - 自动广播状态变化到 EventBus
   * - UI 可监听 'agent:statusChange' 事件实时更新
   * - 便于调试和日志记录
   */
  setStatus(status) {
    this.status = status;
    
    // 广播状态变化事件
    // Broadcast state change event
    this.eventBus.emit('agent:statusChange', {
      role: this.role,
      status: status,
      timestamp: Date.now()
    });
  }

  /**
   * 执行任务 (模板方法)
   * Execute task (Template Method)
   * 
   * @param {Object} task - 任务描述 / Task description
   *                        { description: string, constraints: string[] }
   * @param {string} query - 用户查询 / User query
   * @param {Object} context - 上下文信息 / Context information
   *                          { knowledge: string, history: string }
   * 
   * @returns {Promise<string>} - 执行结果 / Execution result
   * 
   * 执行流程 / Execution Flow:
   * 1. 设置状态为 THINKING
   * 2. 构建提示词 (调用子类的 buildPrompt)
   * 3. 调用 LLM API
   * 4. 设置状态为 COMPLETED
   * 5. 返回结果
   * 
   * 时间复杂度 / Time Complexity: 取决于 LLM API 响应时间
   */
  async execute(task, query, context) {
    // 1. 更新状态 / Update status
    this.setStatus(AgentStatus.THINKING);
    
    try {
      // 2. 构建提示词 (子类实现)
      // Build prompt (implemented by subclass)
      const prompt = this.buildPrompt(task, query, context);
      
      // 3. 调用 LLM API
      // Call LLM API
      const response = await this.llmGateway.complete(prompt);
      
      // 4. 记录历史 / Record history
      this.history.push({
        task,
        query,
        response: response.content,
        timestamp: Date.now()
      });
      
      // 5. 更新状态 / Update status
      this.setStatus(AgentStatus.COMPLETED);
      
      // 6. 返回结果 / Return result
      return response.content;
      
    } catch (error) {
      // 错误处理 / Error handling
      this.setStatus(AgentStatus.ERROR);
      this.eventBus.emit('agent:error', {
        role: this.role,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * 构建提示词 (子类重写)
   * Build prompt (Override in subclass)
   * 
   * @param {Object} task - 任务描述 / Task description
   * @param {string} query - 用户查询 / User query
   * @param {Object} context - 上下文 / Context
   * 
   * @returns {Array} - 消息数组 / Message array
   *                    [{ role: 'system', content: '...' }, 
   *                     { role: 'user', content: '...' }]
   * 
   * 设计模式 / Design Pattern:
   * 这是模板方法模式的核心，子类通过重写此方法实现专业化
   * This is the core of Template Method Pattern, subclasses achieve 
   * specialization by overriding this method
   */
  buildPrompt(task, query, context) {
    // 默认实现 / Default implementation
    return [
      { 
        role: 'system', 
        content: this.getSystemPrompt() 
      },
      { 
        role: 'user', 
        content: `Task: ${task.description}\n\nQuery: ${query}` 
      }
    ];
  }

  /**
   * 获取系统提示词 (子类重写)
   * Get system prompt (Override in subclass)
   * 
   * @returns {string} - 系统提示词 / System prompt
   * 
   * 架构说明 / Architecture Notes:
   * 系统提示词定义了智能体的：
   * 1. 身份定位 / Identity positioning
   * 2. 专业领域 / Professional field
   * 3. 行为约束 / Behavioral constraints
   * 4. 输出格式 / Output format
   */
  getSystemPrompt() {
    return `You are a ${this.role} specialist assistant for Grasshopper parametric design.`;
  }

  /**
   * 获取执行统计
   * Get execution statistics
   * 
   * @returns {Object} - 统计信息 / Statistics
   */
  getStats() {
    return {
      role: this.role,
      status: this.status,
      totalExecutions: this.history.length,
      lastExecution: this.history[this.history.length - 1]?.timestamp || null
    };
  }
}

// ============================================================
// 使用示例 / Usage Example
// ============================================================

/**
 * 创建专家智能体子类
 * Create expert agent subclass
 * 
 * 示例：数据拓扑专家 / Example: DataTree Expert
 */
class DataTreeAgent extends Agent {
  constructor(llmGateway, eventBus) {
    super(AgentRole.DATATREE, llmGateway, eventBus);
  }

  /**
   * 重写系统提示词
   * Override system prompt
   */
  getSystemPrompt() {
    return `你是数据拓扑架构师 (Data Topology Architect)，Grasshopper 参数化设计的数据树专家。

核心职责 / Core Responsibilities:
1. 分析输入数据结构，预测 Data Tree 层级
2. 提供 Graft/Flatten/Simplify 操作建议
3. 验证数据匹配的合法性
4. 防止数据结构塌陷

强制约束 / Mandatory Constraints:
- 必须明确标注每个操作的 Path 变化
- 必须评估操作对性能的影响
- 必须提供数据结构可视化建议`;
  }

  /**
   * 重写提示词构建
   * Override prompt building
   */
  buildPrompt(task, query, context) {
    return [
      { 
        role: 'system', 
        content: this.getSystemPrompt() 
      },
      { 
        role: 'user', 
        content: `【数据拓扑分析任务】

用户查询: ${query}

当前数据结构: ${context.knowledge || '未知'}

请提供详细的数据树操作建议。` 
      }
    ];
  }
}
