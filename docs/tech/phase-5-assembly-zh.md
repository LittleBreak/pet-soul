# 第五阶段：页面装配与路由 (Assembly)

根据 [初始化开发顺序](./init-dev-order.md) 和 [PRD](../prd-zh.md)，本阶段的目标是将之前构建的原子组件（Phase 3）和状态与逻辑（Phase 4）组装成完整的 Next.js 页面，并配置路由跳转。

## 1. 目标

*   构建基于 Next.js App Router 的页面结构。
*   实现"上传 -> 配置 -> 生成 -> 结果"的完整用户操作流。
*   集成全局状态 (`useAppStore`)，确保页面间数据持久化与流转。
*   适配移动端布局（Mobile-First）。

## 2. 路由规划 (App Router)

文件结构基于 Next.js 14+ `app/` 目录。

| 路由路径 | 页面组件 | 功能描述 | 状态依赖 |
| :--- | :--- | :--- | :--- |
| `/` | `app/page.tsx` | **首页 (Landing)**<br>产品介绍、Hero 区域、核心入口（上传照片）。 | 无 |
| `/studio` | `app/studio/page.tsx` | **创作工作台 (Studio)**<br>核心操作页，包含人设选择、预览、生成等待。 | `currentPhoto`<br>若无照片自动跳回首页 |
| `/result` | `app/result/page.tsx` | **结果展示页 (Result)**<br>展示生成文案、合成梗图、分享/下载。 | `generatedCaptions`<br>若无结果自动跳回 Studio |

> **设计决策：** 为什么不把 Studio 和 Result 合并？
> 虽然可以做成单页应用体验，但拆分路由有利于逻辑解耦。`Studio` 专注于"输入与配置"，`Result` 专注于"输出与交互"。

## 3. 页面详细设计

### 3.1 根布局 (`app/layout.tsx`)

*   **功能：** 全局样式注入、字体加载、元数据配置 (SEO)。
*   **包含组件：**
    *   `Toaster` (from `sonner` or `shadcn/ui`): 用于全局错误提示。
    *   `<main className="min-h-screen bg-background ...">`: 移动端全屏容器。

### 3.2 首页 (`app/page.tsx`)

*   **布局结构：**
    *   **Header:** Logo + "关于我们"（简单链接）。
    *   **Hero Section:** 
        *   文案："你的宠物在想什么？"
        *   **CTA Button:** "立即在拍/上传" -> 点击触发隐藏的 `<input type="file">`。
    *   **Showcase:** 简单的滚动展示示例图片（Mock 数据）。
*   **逻辑集成：**
    *   引入 `usePhotoUpload` Hook。
    *   `handleFileChange` 成功后，自动使用 `router.push('/studio')` 跳转。

### 3.3 创作工作台 (`app/studio/page.tsx`)

此页面是用户进行配置的核心区域。

*   **布局结构 (Grid/Flex Column):**
    *   **Top:** 进度条或简单的 "Step 1/2"。
    *   **Preview Area:** 展示 `currentPhoto`。如果图片未加载，显示骨架屏或重定向。
    *   **Persona Selector:** 滑动列表或网格展示 `PERSONAS` 常量。点击选中，高亮状态绑定 `selectedPersonaId`。
    *   **Bottom Action:** "开始读心 (Generate)" 按钮。
*   **逻辑集成：**
    *   `useEffect`: 检查 `useAppStore.currentPhoto`，为空则 `router.replace('/')`。
    *   **点击生成：**
        1.  调用 `useAppStore.startGeneration()`。
        2.  调用 `useAIAnalysis` (Mock) 开始请求。
        3.  进入 `isGenerating` 状态（按钮变 Loading，图片上层覆盖遮罩）。
        4.  请求成功后 -> `router.push('/result')`。

### 3.4 结果页 (`app/result/page.tsx`)

*   **布局结构：**
    *   **Meme Canvas:** 展示最终合成的卡片（图片 + 文案）。
    *   **Caption Slider:** 左右滑动切换 `generatedCaptions` 中的 3 个文案。
        *   切换时更新 Store 的 `selectedCaptionIndex`。
    *   **Action Bar:**
        *   "换一批" (Refresh): 重新触发生成。
        *   "保存图片" (Download): 调用 `useMemeGenerator` 导出。
        *   "分享" (Share): 调起原生分享 API (Mobile) 或复制链接。
*   **逻辑集成：**
    *   引入 `useMemeGenerator` Hook，监听 `currentPhoto` 和 `currentCaption` 的变化，实时渲染 Canvas 预览（也可以只用 DOM 叠加实现 MVP，Canvas 仅用于下载）。

## 4. 路由守卫与重定向

由于状态存储在客户端内存 (Zustand)，刷新页面会导致状态丢失。需要在关键页面做简单的"防呆"处理：

```typescript
// app/studio/page.tsx & app/result/page.tsx
'use client';

useEffect(() => {
  const hasPhoto = useAppStore.getState().currentPhoto;
  if (!hasPhoto) {
    toast.error("请先上传照片");
    router.replace('/');
  }
}, []);
```

## 5. 开发任务清单

1.  **基础页面框架：**
    *   创建 3 个 `page.tsx` 文件，先写简单的 "Hello World" 以验证路由跳转。
2.  **首页开发：**
    *   实现 Hero 区域。
    *   集成 `usePhotoUpload`，测试文件上传后是否正确跳转到 `/studio` 且 Store 中有数据。
3.  **Studio 页面开发：**
    *   实现图片预览组件。
    *   实现人设选择器组件 (复用 Phase 3 的 `PersonaCard` 或类似组件)。
    *   集成 `useAIAnalysis`，测试 Loading 状态和跳转。
4.  **Result 页面开发：**
    *   实现文案切换器 (Carousel/Slider)。
    *   实现基础的"文字覆盖图片"样式 (CSS Overlay)。
    *   实现"下载"功能 (html2canvas 或 原生 Canvas API)。

## 6. UI/UX 细节 (Polish)

*   **转场动画：** 使用 `framer-motion` 为页面切换添加简单的 FadeIn/SlideUp 效果，增加顺滑感。
*   **Loading 态：** 生成过程中，展示有趣的文案（如："正在翻译喵星语...", "正在分析微表情..."）。
*   **响应式：** 确保在移动端浏览器（Safari/Chrome）中，底部按钮不被地址栏遮挡（使用 `dvh` 单位）。
