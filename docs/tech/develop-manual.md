# AI 辅助开发顺序指南

在使用 AI 辅助开发（AI-Native Development）全栈或前端项目时，核心逻辑是**"从抽象到具体"**以及**"从结构到逻辑"**。如果一次性让 AI 生成太多代码，容易出现逻辑断层、组件冗余和类型错误。

以下是建议的开发顺序及最佳实践流程：

---

## 第一阶段：架构设计与需求分析（Blueprint）

在写任何业务代码前，先让 AI 帮你理清思路。

1. **需求分析与页面脑图：** 描述你的项目目标，让 AI 生成功能列表和页面结构清单。
2. **技术栈选型：** 明确框架（如 Next.js / Vue3）、UI 库（如 Tailwind CSS + Shadcn UI）、状态管理（如 Zustand / Pinia）。

> **提示：** 尽量选择 AI 训练数据丰富的流行技术栈。

**产出物：**
- 功能清单文档
- 页面路由结构

---

## 第二阶段：全局数据模型定义（Types）

这是最关键的一步，类型定义决定了后续开发的一致性。

1. **定义核心业务实体：** 根据项目需求，定义 TypeScript 接口。
   * **执行命令：** "请根据我的项目需求，定义核心业务实体的 TypeScript 接口（例如 User, Project, Task 等），并保存为 `types/index.ts`。"

2. **定义 API 契约：** 明确前后端数据交互格式。
   * **执行命令：** "请定义 API 请求和响应的 TypeScript 类型，保存为 `types/api.ts`。"

3. **创建 Zod Schema：** 用于运行时数据校验。
   * **执行命令：** "请根据类型定义创建对应的 Zod Schema，保存在 `lib/validations/` 目录。"

> **目的：** 有了明确的类型定义，后续 AI 生成组件和 API 调用时，一致性会大大提高。

**产出物：**
- `types/index.ts` - 核心业务类型
- `types/api.ts` - API 相关类型
- `lib/validations/*.ts` - Zod Schema
- `lib/constants/*.ts` - 常量配置


---

## 第三阶段：组件库与原子开发（Component-First）

不要直接写页面，先写零件。

1. **基础组件 (Atoms)：** 利用 AI 生成或引入现有的 UI 组件（Button, Input, Modal, Card）。
2. **业务组件 (Molecules)：**
   * **执行命令：** "参考 `types/index.ts` 中的 `Task` 类型，请帮我写一个 `TaskCard` 组件，要求使用 Tailwind 进行响应式设计，并预留 `onEdit` 和 `onDelete` 回调。"

> **最佳实践：** 强制要求 AI 保持组件的**纯粹性（Pure Components）**，即只负责渲染，不负责数据请求。

**产出物：**
- `components/ui/*.tsx` - 基础 UI 组件
- `components/[feature]/*.tsx` - 业务组件

---

## 第四阶段：状态管理与 Mock 数据（State & Logic）

1. **状态管理逻辑：** 定义全局 Store 或 Hooks（如 `useAuth`, `useTasks`）。
2. **Mock 接口：** 在后端 API 没写好前，让 AI 编写 Mock 数据，确保前端能跑通。
   * **执行命令：** "请根据 `Task` 接口生成一组包含 10 条数据的 JSON 数组，用于前端展示测试。"

**产出物：**
- `lib/stores/*.ts` - Zustand Store
- `lib/hooks/*.ts` - 自定义 Hooks
- `__mocks__/*.ts` - Mock 数据

---

## 第五阶段：页面装配与路由（Assembly）

1. **页面组合：** 告诉 AI："现在请帮我创建 `Dashboard` 页面，调用 `useTasks` Hook 获取数据，并循环渲染 `TaskCard` 组件。"
2. **路由配置：** 设置页面间的跳转逻辑。

**产出物：**
- `app/[route]/page.tsx` - 页面组件
- 路由跳转逻辑

---

## AI 辅助开发最佳实践（Tips）

### 1. 遵循"上下文隔离"原则

* **不要发太长的 Prompt：** 每次只解决一个具体问题（如：只写一个组件，或只重构一个函数）。
* **保持上下文同步：** 如果你开启了新对话，记得把之前的 `types/index.ts` 或核心架构逻辑喂给 AI。

### 2. "类型先行"原则

* 始终先写 TypeScript 定义。AI 有了类型约束后，写出的业务逻辑错误率会降低 60% 以上。

### 3. 代码审查与重构

* **让 AI 互相博弈：** 在 AI 生成代码后，可以问："请检查这段代码是否有潜在的性能问题或内存泄漏，并给出优化建议。"
* **提取公共逻辑：** 当你发现两个页面有相似逻辑时，让 AI 帮你提取成自定义 Hooks。

### 4. 推荐工具链

* **IDE 插件：** Cursor 或 Windsurf（目前对项目级上下文理解最强的 IDE）。
* **命令行：** 使用 Claude Code 或 Aider 进行直接的文件修改和操作。

---

## 推荐的执行顺序表

| 阶段 | 步骤 | AI 执行重点 | 产出物 |
| --- | --- | --- | --- |
| 1 | **需求分析** | 生成功能清单和页面结构 | 需求文档、路由规划 |
| 2 | **类型定义** | 生成 `types/*.ts` 和 Zod Schema | 类型文件、校验 Schema |
| 3 | **原子组件** | 生成 `Button`, `Input`, `Card` 等 | UI 组件库 |
| 4 | **Hooks 封装** | 处理数据请求、状态切换逻辑 | Store、Hooks |
| 5 | **页面组装** | 将零件拼成 `Page`，注入数据 | 完整页面 |

