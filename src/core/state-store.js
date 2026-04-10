/**
 * AppStateStore - 全局状态管理
 * Global State Management
 * 
 * ============================================================
 * 设计模式: 单一数据源 (Single Source of Truth)
 * 灵感来源: Redux/Vuex 的简化实现
 * Inspiration: Simplified implementation of Redux/Vuex
 * 
 * 架构说明 / Architecture Notes:
 * - 所有应用状态集中在一个对象中管理
 * - 通过 setState() 统一更新，便于追踪和调试
 * - 支持订阅者模式，状态变化自动通知
 * - 不可变性更新（Immutable Updates），避免副作用
 * 
 * 状态分类 / State Categories:
 * 1. 用户状态 (User State): 认证信息
 * 2. 意图路由 (Intent Routing): 激活的专家
 * 3. 会话状态 (Session State): 对话历史
 * 4. UI 状态 (UI State): 界面配置
 * 5. 配置信息 (Configuration): API 设置
 * ============================================================
 */

class AppStateStore {
  /**
   * 构造函数 / Constructor
   * 
   * 初始化默认状态
   * Initialize default state
   */
  constructor() {
    /**
     * 全局状态对象
     * Global state object
     * 
     * 不可变性原则 / Immutability Principle:
     * - 永远不要直接修改 this.state 的属性
     * - 使用 setState() 创建新对象
     * - 保证状态变化的可追溯性
     */
    this.state = {
      // ============================================================
      // 1. 用户状态 / User State
      // ============================================================
      
      /** 用户信息对象 / User info object */
      user: null,
      // 示例 / Example: { id: 1, username: 'user123' }
      
      /** 认证令牌 / Authentication token */
      token: null,
      // 注意 / Note: 生产环境应使用 JWT
      
      /** 是否已认证 / Authentication status */
      isAuthenticated: false,
      
      // ============================================================
      // 2. 意图路由 / Intent Routing
      // ============================================================
      
      /**
       * 激活的专家意图集合
       * Active expert intents set
       * 
       * 使用 Set 的原因 / Why use Set:
       * - 自动去重 / Auto-deduplication
       * - O(1) 查找复杂度 / O(1) lookup complexity
       * - 语义清晰 / Clear semantics
       * 
       * 默认激活"方法架构"专家
       * Default activate "methodology" expert
       */
      activeIntents: new Set(['methodology']),
      
      // ============================================================
      // 3. 会话状态 / Session State
      // ============================================================
      
      /** 当前会话 ID / Current session ID */
      currentSession: null,
      // 示例 / Example: { id: 1, title: '渐变圆管设计' }
      
      /**
       * 消息历史数组
       * Message history array
       * 
       * 结构 / Structure:
       * [{ role: 'user'|'assistant'|'system', content: '...', timestamp: ... }]
       */
      messageHistory: [],
      
      /** 当前运行时状态 / Current runtime state */
      runtimeState: 'idle',
      // 参考 RuntimeState 常量 / Refer to RuntimeState constants
      
      // ============================================================
      // 4. UI 状态 / UI State
      // ============================================================
      
      /** 深色模式开关 / Dark mode toggle */
      darkMode: false,
      
      /** 当前语言 / Current language */
      language: 'zh', // 'zh' | 'en'
      
      /** 侧边栏是否打开 / Sidebar open status */
      sidebarOpen: false,
      
      // ============================================================
      // 5. 配置信息 / Configuration
      // ============================================================
      
      /** API 基础路径 / API base path */
      apiBase: '/api',
      // 注意 / Note: 生产环境应通过环境变量配置
      
      /** 使用的模型名称 / Model name in use */
      model: 'deepseek-reasoner',
      
      /** 是否启用流式输出 / Enable streaming output */
      streaming: true,
      
      /** 最大对话历史长度 / Max conversation history length */
      maxHistoryLength: 50
    };
    
    /**
     * 状态监听器集合
     * State listeners collection
     * 
     * 当状态变化时，通知所有监听器
     * Notify all listeners when state changes
     */
    this.listeners = new Set();
  }

  /**
   * 获取当前状态
   * Get current state
   * 
   * @returns {Object} - 当前状态对象 / Current state object
   * 
   * 注意 / Note:
   * 返回的是引用，不应直接修改
   * Returns reference, should not be modified directly
   */
  getState() {
    return this.state;
  }

  /**
   * 更新状态
   * Update state
   * 
   * @param {Object} updates - 状态更新对象 / State update object
   *                           只包含需要更新的字段 / Only includes fields to update
   * 
   * 设计原则 / Design Principles:
   * 1. 不可变性 / Immutability: 创建新对象而非修改原对象
   * 2. 浅合并 / Shallow Merge: 只合并顶层字段
   * 3. 通知机制 / Notification: 自动通知所有监听器
   * 
   * 使用示例 / Usage Examples:
   * ```javascript
   * // 更新用户状态
   * store.setState({ 
   *   user: { id: 1, username: 'user123' },
   *   isAuthenticated: true 
   * });
   * 
   * // 添加激活的意图
   * const newIntents = new Set(store.state.activeIntents);
   * newIntents.add('datatree');
   * store.setState({ activeIntents: newIntents });
   * ```
   * 
   * 时间复杂度 / Time Complexity: O(N)，N 为监听器数量
   */
  setState(updates) {
    // 创建新状态对象（不可变更新）
    // Create new state object (immutable update)
    this.state = { 
      ...this.state,  // 复制现有状态 / Copy existing state
      ...updates      // 合并更新字段 / Merge update fields
    };
    
    // 通知所有监听器
    // Notify all listeners
    this.notifyListeners();
  }

  /**
   * 订阅状态变化
   * Subscribe to state changes
   * 
   * @param {Function} listener - 监听器函数 / Listener function
   *                              接收新状态作为参数 / Receives new state as parameter
   * 
   * @returns {Function} - 取消订阅函数 / Unsubscribe function
   * 
   * 使用示例 / Usage Example:
   * ```javascript
   * // 订阅状态变化
   * const unsubscribe = store.subscribe((newState) => {
   *   console.log('State changed:', newState);
   *   updateUI(newState);
   * });
   * 
   * // 组件卸载时取消订阅
   * componentWillUnmount() {
   *   unsubscribe();
   * }
   * ```
   * 
   * 架构价值 / Architecture Value:
   * - 响应式更新 / Reactive updates
   * - 组件解耦 / Component decoupling
   * - 单一数据流 / Single data flow
   */
  subscribe(listener) {
    this.listeners.add(listener);
    
    // 返回取消订阅函数
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }

  /**
   * 通知所有监听器
   * Notify all listeners
   * 
   * 内部方法 / Internal method
   * 在 setState() 后自动调用 / Auto-called after setState()
   * 
   * 错误隔离 / Error Isolation:
   * 一个监听器的异常不影响其他监听器
   * One listener's exception doesn't affect others
   */
  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (e) {
        console.error('[AppStateStore] Error in listener:', e);
      }
    });
  }

  /**
   * 重置状态到初始值
   * Reset state to initial values
   * 
   * 用途 / Purpose:
   * - 用户登出 / User logout
   * - 应用重置 / Application reset
   */
  reset() {
    this.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      activeIntents: new Set(['methodology']),
      currentSession: null,
      messageHistory: [],
      runtimeState: 'idle'
    });
  }

  /**
   * 获取状态的特定字段
   * Get specific field from state
   * 
   * @param {string} key - 字段名 / Field name
   * @returns {*} - 字段值 / Field value
   * 
   * 便捷方法 / Convenience method
   */
  get(key) {
    return this.state[key];
  }

  /**
   * 批量更新状态
   * Batch update state
   * 
   * @param {Function} updateFn - 更新函数 / Update function
   *                              接收当前状态，返回更新对象
   *                              Receives current state, returns update object
   * 
   * 使用示例 / Usage Example:
   * ```javascript
   * store.batchUpdate((state) => ({
   *   activeIntents: new Set([...state.activeIntents, 'datatree'])
   * }));
   * ```
   */
  batchUpdate(updateFn) {
    const updates = updateFn(this.state);
    this.setState(updates);
  }
}

// ============================================================
// 架构学习要点 / Architecture Learning Points
// ============================================================

/**
 * 1. 为什么使用单一数据源？
 *    Why use Single Source of Truth?
 * 
 * - 状态集中管理，便于调试
 *   Centralized state management, easy debugging
 * - 避免状态不一致
 *   Avoid state inconsistencies
 * - 支持时间旅行调试（记录状态变化历史）
 *   Supports time-travel debugging (record state change history)
 */

/**
 * 2. 不可变更新的重要性
 *    Importance of Immutable Updates
 * 
 * - 便于比较状态变化（浅比较）
 *   Easy to compare state changes (shallow comparison)
 * - 避免副作用
 *   Avoid side effects
 * - 支持撤销/重做功能
 *   Supports undo/redo functionality
 * 
 * 错误示例 / Bad Example:
 * ```javascript
 * this.state.user = newUser; // ❌ 直接修改
 * ```
 * 
 * 正确示例 / Good Example:
 * ```javascript
 * this.setState({ user: newUser }); // ✅ 不可变更新
 * ```
 */

/**
 * 3. 与 Redux 的对比
 *    Comparison with Redux
 * 
 * 相似点 / Similarities:
 * - 单一数据源 / Single source of truth
 * - 不可变更新 / Immutable updates
 * - 订阅者模式 / Subscriber pattern
 * 
 * 差异 / Differences:
 * - 更简单，无 Reducer/Action 概念
 *   Simpler, no Reducer/Action concept
 * - 直接调用 setState，无需 dispatch
 *   Direct setState call, no dispatch needed
 * - 适合中小型应用
 *   Suitable for small to medium applications
 */
