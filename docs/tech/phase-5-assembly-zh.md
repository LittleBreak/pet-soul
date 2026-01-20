# 第五阶段：页面装配与路由 (Assembly & Routing)

本阶段是将之前开发的原子组件 (Atoms)、业务组件 (Molecules) 以及状态管理逻辑 (State & Hooks) 整合为完整功能页面的过程。

## 1. 目标

*   实现从 "首页上传 -> 人设选择 -> AI 生成等待 -> 结果展示 -> 梗图编辑 -> 分享保存" 的完整业务闭环。
*   配置 Next.js App Router 路由体系。
*   确保页面间的状态同步与转场动画流畅。
*   实现全局布局 (Layout) 和导航体系。

## 2. 路由结构规划

根据 Next.js 约定，路由结构如下：

```text
app/
├── layout.tsx                # 全局布局：提供背景色、字体、Toast 容器
├── page.tsx                  # 首页 (Home)
├── generate/
│   └── page.tsx              # 生成配置页 (Generate)
├── result/
│   └── page.tsx              # 结果展示页 (Result)
├── meme/
│   └── page.tsx              # 梗图编辑页 (Meme Editor)
└── history/                  # (P1) 历史记录页
    └── page.tsx
```

## 3. 页面详细设计

### 3.1 首页 (Home Page)
*   **路径:** `/`
*   **职责:** 引导用户上传宠物照片。
*   **布局逻辑:** 使用 `MainLayout`，内容垂直居中。
*   **核心组件:**
    *   `<CreditDisplay />`: 顶部展示今日剩余次数 (来自 `useUserStore`)。
    *   `<PhotoUploader />`: 核心区域，虚线框占位。支持点击、拖拽或调用相机。
*   **流程控制:**
    *   `onUploadSuccess`: 图片压缩并转换为 Base64/Blob 后，调用 `useAppStore.setPhoto(url)`，然后 `router.push('/generate')`。

### 3.2 生成配置页 (Generate Page)
*   **路径:** `/generate`
*   **职责:** 预览照片并选择宠物人设，触发 AI 解析。
*   **布局逻辑:** 顶部预览图 (25% 高度)，中部人设网格。
*   **核心组件:**
    *   `<PersonaSelector />`: 6 种预设人设卡片，支持选中态切换。
    *   `<Button>`: "开始解读" 主按钮，位于底部固定位置。
*   **流程控制:**
    *   点击"开始解读"时，调用 `useAppStore.startGeneration()`。
    *   展示全屏加载蒙层 `<AnalyzeLoading />`，轮播趣味文案（如 "正在读取主子的脑电波..."）。
    *   API 请求成功后，自动跳转至 `/result`；若失败，弹出 Toast 并停留在当前页。

### 3.3 结果展示页 (Result Page)
*   **路径:** `/result`
*   **职责:** 展示 AI 生成的内心戏，支持多版本切换。
*   **布局逻辑:** 沉浸式设计，图片占据主要视觉中心。
*   **核心组件:**
    *   `<ResultCarousel />`: 使用 Swiper 或 Framer Motion 实现左右滑动预览 3 个版本的文案。
    *   `<ActionPanel />`:
        *   "换一批": 重新调用生成接口 (P1 功能)。
        *   "制作梗图": 将当前选中的文案索引存入 Store，并 `router.push('/meme')`。
*   **状态同步:** 监听 `useAppStore` 中的 `selectedCaptionIndex`。

### 3.4 梗图编辑页 (Meme Editor Page)
*   **路径:** `/meme`
*   **职责:** 编辑梗图样式（字体、滤镜、位置）并保存分享。
*   **布局逻辑:** 编辑器布局，上半部分为 Canvas，下半部分为工具栏 Tab。
*   **核心组件:**
    *   `<MemeEditor />`: 基于 Konva/Canvas 的实时预览组件。
    *   `<Tabs>` (Font/Filter/Position): 控制编辑参数。
    *   `<ExportPanel />`: 提供 "保存到相册" 和 "一键分享" 功能。
*   **逻辑处理:**
    *   调用 `useMemeGenerator` Hook 处理最终导出。
    *   集成原生分享 API 或显示二维码弹窗 `<ShareSheet />`。

## 4. 全局交互与规范

### 4.1 状态驱动导航
*   **防误入机制:** 在 `/generate`, `/result`, `/meme` 页面增加 `useEffect` 校验。若 `appStore.currentPhoto` 为空，自动重定向回首页 `/`。
*   **物理返回键:** 确保 Next.js `router.back()` 逻辑符合预期，特别是在生成中的状态处理。

### 4.2 UI 响应式与适配
*   **移动端优先:** 针对 iOS/Android 浏览器安全区 (safe-area) 进行适配。
*   **背景规范:** 全局应用奶油白 (`#FFF9F0`) 背景。

### 4.3 错误处理 (Error Boundary)
*   实现全局 `error.tsx` 捕获组件崩溃。
*   API 超时或识别不到宠物时，弹出业务弹窗提示，引导用户重新上传。

## 5. 开发任务清单 (Checklist)

1. [ ] **路由搭建:** 创建 `app/` 文件夹及各子页面 `page.tsx` 空壳。
2. [ ] **首页装配:** 集成 `PhotoUploader` 和 Store 跳转逻辑。
3. [ ] **生成页逻辑:** 实现人设选择与 AI 模拟调用 (对接 Phase 4 Hooks)。
4. [ ] **结果页开发:** 完成 Carousel 滑动效果与文案映射。
5. [ ] **编辑器集成:** 将 Canvas 逻辑注入 `/meme` 页面，实现样式实时预览。
6. [ ] **全链路测试:** 从上传到保存图片的完整流程走通。
7. [ ] **视觉打磨:** 添加 Framer Motion 页面切换动画。

## 6. 参考文档
*   [PRD：宠灵感](../prd-zh.md)
*   [UI/UX 设计稿规范](../ux.md)
*   [第四阶段：状态管理文档](./phase-4-state-management-zh.md)
