# 扩展开发指南 / Extension Development Guide

**项目名称 / Project Name**: GH Helper（小壁蜂OsmiaAI）  
**版本 / Version**: v0.3.8-beta  
**在线体验 / Live Demo**: https://topogenesis.top/intro/ghhelper  
**目标读者 / Target Audience**: 开发者 / Developers

---

## 📋 概览 / Overview

**中文**: 本文档介绍如何扩展 GH Helper（小壁蜂OsmiaAI） 系统，包括添加新的专家智能体、扩展知识库、自定义工作流和开发插件。系统采用模块化设计，具有良好的可扩展性。

**English**: This document introduces how to extend the GH Helper (OsmiaAI) system, including adding new expert agents, extending knowledge base, customizing workflows, and developing plugins. The system adopts a modular design with good extensibility.

---

## 1. 添加新的专家智能体
## 1. Adding New Expert Agents

### 1.1 架构说明 / Architecture Description

**中文**: 专家智能体是系统的核心组件，每个专家都有独特的系统提示词和专业视角。添加新专家需要以下步骤：

**English**: Expert agents are core components of the system, each with unique system prompts and professional perspectives. Adding a new expert requires the following steps:

### 1.2 步骤一：定义角色常量
### Step One: Define Role Constant

```javascript
// 在 src/core/constants.js 中添加
// Add to src/core/constants.js

const AgentRole = {
  // ... 现有角色 / existing roles ...
  
  /**
   * 新增专家角色示例：结构分析专家
   * New expert role example: Structural Analysis Expert
   */
  STRUCTURAL: 'structural'
};
```

### 1.3 步骤二：创建专家类
### Step Two: Create Expert Class

```javascript
/**
 * StructuralAgent - 结构分析专家
 * Structural Analysis Expert
 * 
 * 职责 / Responsibilities:
 * - 分析 Grasshopper 定义的结构稳定性
 * - 提供结构优化建议
 * - 评估材料使用效率
 */
class StructuralAgent extends Agent {
  /**
   * 构造函数 / Constructor
   */
  constructor(llmGateway, eventBus) {
    // 调用父类构造函数
    // Call parent constructor
    super(AgentRole.STRUCTURAL, llmGateway, eventBus);
  }

  /**
   * 系统提示词
   * System Prompt
   * 
   * 设计原则 / Design Principles:
   * 1. 明确身份定位 / Clear identity positioning
   * 2. 定义专业领域 / Define professional field
   * 3. 设置行为约束 / Set behavioral constraints
   * 4. 规范输出格式 / Standardize output format
   */
  getSystemPrompt() {
    return `你是结构分析专家 (Structural Analysis Expert)，专注于 Grasshopper 参数化设计的结构稳定性和材料优化。

【核心职责 / Core Responsibilities】
1. 分析几何结构的稳定性和可行性
2. 评估材料使用效率和成本
3. 提供结构优化建议
4. 识别潜在的结构风险

【强制约束 / Mandatory Constraints】
- 必须考虑实际建造的可行性
- 必须评估不同材料的适用性
- 必须提供结构安全系数建议
- 如涉及复杂结构，建议引入有限元分析插件

【输出格式 / Output Format】
请使用 <<<SPLIT>>> 分隔以下内容：
1. 结构稳定性分析
<<<SPLIT>>>
2. 材料优化建议
<<<SPLIT>>>
3. 风险评估与安全系数`;
  }

  /**
   * 构建提示词
   * Build Prompt
   * 
   * 自定义提示词构建逻辑
   * Custom prompt building logic
   */
  buildPrompt(task, query, context) {
    return [
      { 
        role: 'system', 
        content: this.getSystemPrompt() 
      },
      { 
        role: 'user', 
        content: `【结构分析任务 / Structural Analysis Task】

用户查询: ${query}

几何信息: ${context.geometry || '未提供'}

请提供详细的结构分析和优化建议。` 
      }
    ];
  }
}
```

### 1.4 步骤三：注册到意图矩阵
### Step Three: Register to Intent Matrix

```javascript
// 在 INTENT_DATA 中添加新专家
// Add new expert to INTENT_DATA

const INTENT_DATA = {
  // ... 现有专家 / existing experts ...
  
  /**
   * 结构分析专家
   * Structural Analysis Expert
   */
  'structural': {
    role: "结构分析专家 (Structural Analysis Expert)",
    debate: "严格评估结构稳定性，考虑材料强度、荷载分布、安全系数，并强制要求提供替代结构方案对比。",
    output: "结构稳定性深度分析\\n<<<SPLIT>>>\\n材料优化建议与成本评估\\n<<<SPLIT>>>\\n风险评估与安全系数计算"
  }
};
```

### 1.5 步骤四：更新 AgentFactory
### Step Four: Update AgentFactory

```javascript
/**
 * AgentFactory - 智能体工厂
 * Agent Factory
 * 
 * 添加新专家的创建逻辑
 * Add creation logic for new expert
 */
class AgentFactory {
  static createAgent(role, llmGateway, eventBus) {
    const agentMap = {
      [AgentRole.LEAD]: () => new LeadAgent(llmGateway, eventBus),
      [AgentRole.METHODOLOGY]: () => new SpecialistAgent(AgentRole.METHODOLOGY, llmGateway, eventBus),
      [AgentRole.DATATREE]: () => new SpecialistAgent(AgentRole.DATATREE, llmGateway, eventBus),
      // ... 其他专家 / other experts ...
      
      // 新增专家
      // New expert
      [AgentRole.STRUCTURAL]: () => new StructuralAgent(llmGateway, eventBus)
    };

    const creator = agentMap[role];
    if (!creator) {
      throw new Error(`Unknown agent role: ${role}`);
    }

    return creator();
  }
}
```

### 1.6 步骤五：添加 UI 按钮
### Step Five: Add UI Button

```html
<!-- 在 HTML 中添加新的路由按钮 -->
<!-- Add new routing button in HTML -->

<button class="scenario-btn" data-intent="structural">
  <span class="icon">🏗️</span>
  <span class="label">结构分析</span>
  <span class="label-en">Structural</span>
</button>
```

```css
/* 添加图标映射 */
/* Add icon mapping */
.agent-icon-structural::before {
  content: '🏗️';
}
```

---

## 2. 扩展知识库
## 2. Extending Knowledge Base

### 2.1 知识库架构 / Knowledge Base Architecture

```
knowledge/
├── index.json              # 主索引文件
├── native/                 # 原生组件知识
│   ├── gh_params_input.json
│   ├── gh_math_sets_tree.json
│   └── ... (新增文件)
└── plugin/                 # 插件知识
    ├── gh_weaverbird.json
    └── ... (新增文件)
```

### 2.2 步骤一：创建知识文件
### Step One: Create Knowledge File

```json
{
  "collection_id": "gh_structural_analysis",
  "version": "1.0.0",
  "components": [
    {
      "name": "Karamba3D",
      "category": "结构分析插件",
      "description": "Grasshopper 的有限元分析插件",
      "inputs": [
        {
          "name": "Geometry",
          "type": "Brep/Mesh",
          "description": "待分析的几何体"
        },
        {
          "name": "Material",
          "type": "Material Object",
          "description": "材料属性"
        },
        {
          "name": "Loads",
          "type": "Load List",
          "description": "荷载列表"
        }
      ],
      "outputs": [
        {
          "name": "Displacements",
          "type": "Vector List",
          "description": "位移结果"
        },
        {
          "name": "Stresses",
          "type": "Tensor List",
          "description": "应力结果"
        },
        {
          "name": "Utilization",
          "type": "Number List",
          "description": "利用率"
        }
      ],
      "usage_notes": "需要预先定义材料属性和边界条件",
      "common_issues": [
        "网格质量影响计算精度",
        "非线性分析需要迭代求解"
      ]
    }
  ]
}
```

### 2.3 步骤二：更新索引
### Step Three: Update Index

```json
// knowledge/index.json
{
  "collections": [
    // ... 现有集合 / existing collections ...
    
    {
      "id": "gh_structural_analysis",
      "title": "结构分析工具",
      "file": "plugin/gh_structural_analysis.json",
      "keywords": [
        "结构", "分析", "finite element", "karamba",
        "stress", "displacement", "荷载"
      ],
      "scenarios": [
        "结构稳定性分析",
        "材料优化",
        "荷载计算",
        "安全系数评估"
      ],
      "priority": 4
    }
  ]
}
```

### 2.4 知识库最佳实践 / Knowledge Base Best Practices

**中文**:
1. **结构化数据**: 使用一致的 JSON 结构
2. **关键词覆盖**: 包含中英文关键词
3. **场景描述**: 详细描述应用场景
4. **优先级设置**: 根据重要性设置 priority (1-5)
5. **版本控制**: 维护版本号便于更新

**English**:
1. **Structured Data**: Use consistent JSON structure
2. **Keyword Coverage**: Include both Chinese and English keywords
3. **Scenario Description**: Describe application scenarios in detail
4. **Priority Setting**: Set priority (1-5) based on importance
5. **Version Control**: Maintain version numbers for updates

---

## 3. 自定义工作流
## 3. Customizing Workflows

### 3.1 工作流架构 / Workflow Architecture

```javascript
/**
 * 工作流引擎允许自定义执行策略
 * Workflow engine allows custom execution strategies
 * 
 * 基本流程 / Basic Flow:
 * 1. 分析任务复杂度
 * 2. 选择合适的工作流类型
 * 3. 执行工作流
 * 4. 聚合结果
 */
```

### 3.2 创建自定义工作流
### Create Custom Workflow

```javascript
/**
 * CustomWorkflow - 自定义工作流示例
 * Custom Workflow Example
 * 
 * 场景：需要多轮迭代优化的设计任务
 * Scenario: Design tasks requiring multi-round iterative optimization
 */
class IterativeOptimizationWorkflow {
  /**
   * 执行工作流
   * Execute workflow
   * 
   * @param {Object} task - 任务描述
   * @param {Array} agents - 智能体列表
   * @param {Object} context - 上下文
   */
  async execute(task, agents, context) {
    const maxIterations = 3;
    let currentResult = null;
    
    for (let i = 0; i < maxIterations; i++) {
      // 1. 当前方案分析
      // Current solution analysis
      const analysis = await agents.analyst.execute(
        { description: '分析当前方案' },
        task.query,
        { previous: currentResult }
      );
      
      // 2. 优化建议
      // Optimization suggestions
      const optimization = await agents.optimizer.execute(
        { description: '提供优化建议' },
        task.query,
        { analysis: analysis }
      );
      
      // 3. 实施优化
      // Implement optimization
      currentResult = await agents.implementer.execute(
        { description: '实施优化方案' },
        task.query,
        { optimization: optimization }
      );
      
      // 4. 评估是否继续
      // Evaluate whether to continue
      const evaluation = await agents.evaluator.execute(
        { description: '评估优化结果' },
        task.query,
        { result: currentResult }
      );
      
      if (evaluation.meetsCriteria) {
        break; // 满足标准，提前结束
      }
    }
    
    return currentResult;
  }
}
```

### 3.3 注册工作流
### Register Workflow

```javascript
// 在 WorkflowType 中添加新类型
// Add new type to WorkflowType

const WorkflowType = {
  // ... 现有类型 / existing types ...
  
  /**
   * 迭代优化工作流
   * Iterative Optimization Workflow
   */
  ITERATIVE: 'iterative_optimization'
};

// 在 WorkflowEngine 中添加执行逻辑
// Add execution logic to WorkflowEngine

class WorkflowEngine {
  async execute(type, task, agents, context) {
    const workflowMap = {
      [WorkflowType.SIMPLE]: new SimpleWorkflow(),
      [WorkflowType.SWARM]: new SwarmWorkflow(),
      // ... 其他工作流 / other workflows ...
      
      // 新增工作流
      // New workflow
      [WorkflowType.ITERATIVE]: new IterativeOptimizationWorkflow()
    };

    const workflow = workflowMap[type];
    if (!workflow) {
      throw new Error(`Unknown workflow type: ${type}`);
    }

    return await workflow.execute(task, agents, context);
  }
}
```

---

## 4. 插件开发规范
## 4. Plugin Development Standards

### 4.1 插件架构 / Plugin Architecture

**中文**: 系统的插件主要是知识库扩展和 UI 组件，不涉及核心逻辑修改。

**English**: System plugins are mainly knowledge base extensions and UI components, not involving core logic modifications.

### 4.2 知识库插件开发
### Knowledge Base Plugin Development

**步骤 / Steps**:
1. 创建 JSON 知识文件
2. 更新 index.json 索引
3. 测试关键词匹配
4. 验证输出格式

### 4.3 UI 组件插件开发
### UI Component Plugin Development

```javascript
/**
 * CustomPanel - 自定义面板示例
 * Custom Panel Example
 * 
 * 例如：3D 预览面板
 * Example: 3D Preview Panel
 */
class Preview3DPanel {
  constructor(container) {
    this.container = container;
    this.canvas = this.createCanvas();
    this.scene = this.createScene();
  }

  createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.className = 'preview-3d-canvas';
    this.container.appendChild(canvas);
    return canvas;
  }

  /**
   * 渲染几何体
   * Render geometry
   */
  render(geometry) {
    // 清除画布
    // Clear canvas
    this.clear();
    
    // 渲染几何体
    // Render geometry
    this.drawGeometry(geometry);
    
    // 更新视图
    // Update view
    this.updateView();
  }

  clear() {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGeometry(geometry) {
    // 实现几何体绘制逻辑
    // Implement geometry drawing logic
  }

  updateView() {
    // 更新视图
    // Update view
  }
}
```

---

## 5. 开发工具推荐
## 5. Recommended Development Tools

---

**最后更新 / Last Updated**: 2026-04-10
