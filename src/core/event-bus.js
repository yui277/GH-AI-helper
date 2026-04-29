/**
 * EventBus - 事件总线实现
 * Event Bus Implementation
 * 
 * ============================================================
 * 设计模式: 发布-订阅 (Publish-Subscribe Pattern)
 * 用途: 解耦模块间通信，实现观察者模式
 * Purpose: Decouple inter-module communication, implement Observer pattern
 * 
 * 架构说明 / Architecture Notes:
 * - 使用 Map 存储事件处理器，key 为事件名，value 为 Set (回调函数集合)
 * - 使用 Set 而非 Array 存储回调，自动去重，O(1) 删除复杂度
 * - 返回取消订阅函数，遵循 React Hooks 的清理模式
 * 
 * 典型事件流 / Typical Event Flow:
 * 1. 模块 A 发布事件: eventBus.emit('user:input', data)
 * 2. 模块 B, C, D 订阅该事件并收到通知
 * 3. 各模块独立处理，互不干扰
 * ============================================================
 */

class EventBus {
  /**
   * 构造函数 / Constructor
   * 
   * 初始化事件存储结构
   * Initialize event storage structure
   */
  constructor() {
    // Map<事件名, Set<回调函数>>
    // Map<event name, Set<callback functions>>
    this.events = new Map();
  }

  /**
   * 订阅事件
   * Subscribe to an event
   * 
   * @param {string} event - 事件名称 / Event name
   *                         示例: 'agent:statusChange', 'llm:usage'
   * @param {Function} callback - 回调函数 / Callback function
   *                              接收事件数据作为参数 / Receives event data as parameter
   * 
   * @returns {Function} - 取消订阅函数 / Unsubscribe function
   *                       调用此函数可取消订阅 / Call this function to unsubscribe
   * 
   * 时间复杂度 / Time Complexity: O(1)
   * 空间复杂度 / Space Complexity: O(1)
   * 
   * 使用示例 / Usage Example:
   * ```javascript
   * // 订阅智能体状态变化
   * const unsubscribe = eventBus.on('agent:statusChange', (data) => {
   *   console.log(`Agent ${data.role} is now ${data.status}`);
   * });
   * 
   * // 取消订阅
   * unsubscribe();
   * ```
   */
  on(event, callback) {
    // 如果事件不存在，创建新的 Set
    // If event doesn't exist, create new Set
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    
    // 添加回调函数到集合
    // Add callback function to set
    this.events.get(event).add(callback);
    
    // 返回取消订阅函数（闭包）
    // Return unsubscribe function (closure)
    return () => this.off(event, callback);
  }

  /**
   * 取消订阅
   * Unsubscribe from an event
   * 
   * @param {string} event - 事件名称 / Event name
   * @param {Function} callback - 要移除的回调函数 / Callback function to remove
   * 
   * 时间复杂度 / Time Complexity: O(1)
   * 注意 / Note: Set.delete() 是 O(1) 操作
   */
  off(event, callback) {
    if (this.events.has(event)) {
      this.events.get(event).delete(callback);
      
      // 可选优化：如果 Set 为空，删除整个事件键
      // Optional optimization: If Set is empty, delete entire event key
      if (this.events.get(event).size === 0) {
        this.events.delete(event);
      }
    }
  }

  /**
   * 发布事件
   * Publish an event
   * 
   * @param {string} event - 事件名称 / Event name
   * @param {*} payload - 事件数据 / Event data
   *                      可以是任意类型 / Can be any type
   * 
   * 时间复杂度 / Time Complexity: O(N)，N 为订阅者数量
   * 执行策略 / Execution Strategy: 同步执行所有回调
   *                              Synchronously execute all callbacks
   * 
   * 使用示例 / Usage Example:
   * ```javascript
   * // 发布智能体状态变化
   * eventBus.emit('agent:statusChange', {
   *   role: 'methodology',
   *   status: 'thinking',
   *   timestamp: Date.now()
   * });
   * ```
   */
  emit(event, payload) {
    if (!this.events.has(event)) {
      return; // 没有订阅者，直接返回 / No subscribers, return early
    }

    // 遍历所有订阅者并执行回调
    // Iterate all subscribers and execute callbacks
    this.events.get(event).forEach(callback => {
      try {
        callback(payload);
      } catch (e) {
        // 错误隔离：一个回调的异常不影响其他回调
        // Error isolation: One callback's exception doesn't affect others
        console.error(`[EventBus] Error in event handler for ${event}:`, e);
      }
    });
  }

  /**
   * 获取事件的订阅者数量
   * Get subscriber count for an event
   * 
   * @param {string} event - 事件名称 / Event name
   * @returns {number} - 订阅者数量 / Subscriber count
   * 
   * 用途: 调试和监控 / Purpose: Debugging and monitoring
   */
  listenerCount(event) {
    if (!this.events.has(event)) {
      return 0;
    }
    return this.events.get(event).size;
  }

  /**
   * 移除事件的所有订阅者
   * Remove all subscribers for an event
   * 
   * @param {string} event - 事件名称 / Event name
   * 
   * 用途: 清理资源 / Purpose: Resource cleanup
   */
  removeAllListeners(event) {
    if (this.events.has(event)) {
      this.events.delete(event);
    }
  }

  /**
   * 获取所有事件名称
   * Get all event names
   * 
   * @returns {Array<string>} - 事件名称数组 / Array of event names
   */
  eventNames() {
    return Array.from(this.events.keys());
  }
}

// ============================================================
// 架构说明 / Architecture Notes
// ============================================================

/**
 * 1. 为什么使用 Set 而不是 Array？
 *    Why use Set instead of Array?
 * 
 * - Set 自动去重，避免重复订阅
 *   Set auto-deduplicates, avoiding duplicate subscriptions
 * - Set.delete() 是 O(1)，Array.splice() 是 O(N)
 *   Set.delete() is O(1), Array.splice() is O(N)
 * - Set 更适合表示“集合”语义
 *   Set is more suitable for "collection" semantics
 */

/**
 * 2. 为什么返回取消订阅函数？
 *    Why return unsubscribe function?
 * 
 * - 遵循 React Hooks 的清理模式 (useEffect return)
 *   Follows React Hooks cleanup pattern (useEffect return)
 * - 便于组件卸载时自动清理
 *   Easy to auto-cleanup when component unmounts
 * - 避免内存泄漏
 *   Prevents memory leaks
 */

/**
 * 3. 错误隔离的重要性
 *    Importance of Error Isolation
 * 
 * - 一个回调的异常不应影响其他回调
 *   One callback's exception shouldn't affect others
 * - 使用 try-catch 包裹每个回调
 *   Wrap each callback with try-catch
 * - 记录错误但继续执行
 *   Log error but continue execution
 */
