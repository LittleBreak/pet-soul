# 第三阶段：组件库与原子开发 (Component-First)

本文档详细规划了 [PetSoul 宠灵感] 项目的 UI 组件库开发方案。遵循 "Atomic Design" 设计方针，我们将首先构建基础原子组件 (Atoms)，然后组合成业务分子组件 (Molecules)。

本阶段的目标不仅仅是功能实现，更是确立应用的 **"Premium UI"** 质感和**交互体验**。

---

## 1. 设计系统与全局样式 (Design System)

在开始组件开发前，需确立全局设计令牌 (Design Tokens)。

### 1.1 核心配色 (Color Palette)
采用温暖、活力且具有现代感的配色方案，适配 Dark/Light 模式。

- **Primary (品牌主色)**:
  - `primary-500`: `#FF6B6B` (活力珊瑚红 - 用于主按钮、强调行动)
  - `primary-100`: `#FFF0F0` (浅色背景、Hover 态)
- **Secondary (辅助色)**:
  - `secondary-500`: `#4ECDC4` (清爽薄荷绿 - 用于成功状态、次要高亮)
  - `accent-500`: `#FFE66D` (明亮黄 - 用于强调"灵感"、VIP 标识)
- **Neutral (中性色)**:
  - `slate-900`: 用于正文文本 (Dark mode 背景)
  - `slate-50`: 用于页面背景 (Light mode)
  - `glass`: `rgba(255, 255, 255, 0.7)` + `backdrop-blur-md` (玻璃拟态效果)

### 1.2 排版 (Typography)
- **Font Family**: 使用 Google Fonts `Outfit` (标题) + `Inter` (正文)。
- **Scale**:
  - `h1`: 24px (Mobile) / 32px (Desktop) - 页面标题
  - `h2`: 20px / 24px - 模块标题
  - `body`: 16px - 标准正文
  - `caption`: 14px - 辅助文字

### 1.3 交互动效 (Animations)
- **Micro-interactions**: 按钮点击缩放 (`active:scale-95`)，卡片 Hover 上浮。
- **Transitions**: 页面切换使用 `framer-motion` 实现平滑过渡。

---

## 2. 基础原子组件 (Atoms / UI Library)

我们将基于 **Radix UI** + **Tailwind CSS** (推荐使用 `shadcn/ui` CLI 工具) 构建基础组件库。

| 组件名 | 用途 | 关键属性 (Props) | 样式要求 |
| --- | --- | --- | --- |
| **Button** | 通用按钮 | `variant` (default, secondary, ghost, outline), `size`, `loading` | 圆角大 (`rounded-full` 或 `xl`)，支持 Loading 状态 spinner |
| **Input / Textarea** | 表单输入 | `error` (errorMessage) | 聚焦时有明显的主色光晕 (Ring) |
| **Card** | 容器 | `hoverEffect` (boolean) | 默认白色/深色背景，轻微阴影，支持玻璃拟态变体 |
| **Dialog / Modal** | 弹窗 | `trigger`, `content` | 带有背景模糊遮罩 (`backdrop-blur`) |
| **Toast** | 全局提示 | `type` (success, error) | 顶部或底部浮动，自动消失 |
| **Avatar** | 头像显示 | `src`, `fallback` | 圆形，支持图片加载失败回退文字 |
| **Badge** | 标签/状态 | `variant` (outline, solid) | 小字号，胶囊形状 |
| **Skeleton** | 骨架屏 | `className` | 用于图片/内容加载时的占位动画 |
| **Slider** | 滑动条 | `value`, `onChange` | 用于调节滤镜强度等 |
| **Tabs** | 选项卡 | `value`, `onValueChange` | 用于在不同功能区切换 (如: 字体/滤镜) |

> **开发指令建议**: 使用 `npx shadcn-ui@latest add button card dialog input toast avatar badge skeleton slider tabs` 批量初始化。

---

## 3. 业务分子组件 (Molecules / Business Components)

业务组件将组合基础组件，通过 Props 接收数据，并处理特定业务逻辑 (如回调函数)。

### 3.1 核心功能区 (Core Features)

#### `PhotoUploader` (照片上传器)
- **描述**: 核心交互入口，支持拖拽和点击上传。
- **状态**: 空闲 (Idle)、拖拽中 (Dragging)、上传处理中 (Uploading/Analyzing)、完成 (Done)。
- **交互**:
  - 空闲状态展示精美插画/图标。
  - 上传中展示进度条或趣味动画 ("AI 正在盯着你的猫看...")。
- **Props**: `onFileSelect(file: File) => void`

#### `PersonaSelector` (人设选择器)
- **描述**: 用于选择宠物的“性格/人设”。
- **结构**: 横向滚动列表或网格。
- **子组件**: `PersonaCard` (显示图标、名称、简述)。
- **交互**: 点击选中，选中态有高亮边框和对勾图标。
- **Props**:
  - `personas`: `Persona[]` (从 Types 引入)
  - `selectedId`: `string`
  - `onSelect(id: string) => void`

#### `ResultCarousel` (生成结果轮播)
- **描述**: 展示 AI 生成的 3 个版本的内心戏文案。
- **结构**: 支持左右滑动的轮播图 (Carousel)。
- **子组件**: `ResultCard` (展示单条文案)。
- **交互**: 滑动切换，底部有指示点 (Dots indicator)。
- **Props**:
  - `results`: `GenerationResult[]`
  - `currentResultIndex`: `number`
  - `onSelectResult(index: number) => void`

#### `MemeEditor` (梗图编辑器)
- **描述**: 图片预览区域，允许用户叠加样式。
- **功能**:
  - 显示底图。
  - 叠加选中的文案。
  - 切换字体/样式 (通过工具栏)。
- **Props**:
  - `imageUrl`: `string`
  - `text`: `string`
  - `styleOptions`: `MemeStyleOptions`

#### `ExportPanel` (导出/分享面板)
- **描述**: 提供下载和分享到社交平台的入口。
- **结构**: 一组图标按钮 (Grid 布局)。
- **Props**:
  - `onDownload() => void`
  - `onShare(platform: 'wechat' | 'xiaohongshu' | ...) => void`

### 3.2 宠物档案区 (Pet Profile)

#### `PetCard` (宠物卡片)
- **描述**: 在个人中心展示宠物信息。
- **内容**: 宠物头像、名字、品种标签、性格标签列表。
- **Props**: `pet: Pet`

#### `CreditDisplay` (额度展示)
- **描述**: 展示用户剩余的免费生成次数或会员状态。
- **样式**: 使用醒目的颜色或进度条暗示剩余量。

---

## 4. 开发与测试策略 (Development & Testing)

为确保组件的**纯粹性 (Purity)** 和**可复用性**，建议在页面组装前独立开发和测试组件。

### 4.1 Storybook / 预览页环境
由于本项目规模较小，建议直接创建一个 `app/design-system/page.tsx` 路由作为内部组件预览页 (Kitchen Sink)。
- 在该页面引入所有 Atoms 和 Molecules。
- 模拟各种 Props 状态 (如 Loading, Error, Empty)。

### 4.2 响应式检查
- 所有组件必须默认支持 Mobile First (移动端优先)。
- 在预览页中通过调整浏览器窗口大小，验证组件在 Mobile (375px) 和 Desktop (1024px+) 下的表现。

### 4.3 无障碍 (Accessibility / a11y)
- 确保所有 `Button` 和表单元素有 `aria-label`。
- 图片元素必须包含 `alt` 属性。
- 颜色对比度需符合 WCAG AA 标准 (特别是文字在图片上的显示，需添加阴影或半透明底衬)。

---

## 5. 目录结构规范

```text
src/
├── components/
│   ├── ui/                 # 原子组件 (shadcn/ui 自动生成)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── business/           # 业务分子组件
│   │   ├── photo-uploader.tsx
│   │   ├── persona-selector.tsx
│   │   ├── meme-editor.tsx
│   │   └── pet-card.tsx
│   ├── layout/             # 布局组件
│   │   ├── main-nav.tsx
│   │   └── mobile-tab-bar.tsx
│   └── shared/             # 通用复用组件
│       ├── icons.tsx       # 图标集合
│       └── logo.tsx
```

下一步建议：根据此文档，使用 AI 辅助生成具体的组件代码，从 `ui` 目录开始，然后构建 `business` 目录。
