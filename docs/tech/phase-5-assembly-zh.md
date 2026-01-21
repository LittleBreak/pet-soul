# Phase 5: 页面装配与路由 (Assembly)

基于 `docs/tech/develop-manual.md` 的第五阶段指南，本阶段我们将把已开发的 UI 组件（Phase 3）和状态管理逻辑（Phase 4）组装成完整的应用程序页面。

根据最新规划，应用结构大幅简化，核心创作流程不再分散在多个路由中，而是通过**首页的状态切换**来实现。

---

## 1. 路由结构规划 (Route Structure)

采用 Next.js App Router 目录结构。应用由三个主要的一级页面组成：

```text
app/
├── layout.tsx                  # Root Layout (包含全局 Providers 和 底部导航栏)
├── page.tsx                    # 首页 (Main/Create) - 包含上传、人设选择、结果编辑全流程
├── history/
│   └── page.tsx                # 创作历史 (History)
└── profile/
    └── page.tsx                # 个人中心 (Profile)
```

---

## 2. 布局策略 (Layout Strategy)

### 2.1 Root Layout (`app/layout.tsx`)
* **职责**：全局配置、字体加载、Providers 注入、底部导航栏挂载。
* **包含组件**：
    * `Toaster` (Sonner)
    * `ThemeProvider` (Next-themes)
    * `MobileTabBar` (底部导航，用于在 首页/历史/个人中心 之间切换)
    * 全局 CSS (`globals.css`)

---

## 3. 页面装配详情 (Page Assembly)

### 3.1 首页 (Home/Create)
* **路径**：`app/page.tsx`
* **功能**：作为核心创作入口，根据 `useMemeGenerator` 的状态（或页面内部状态）动态展示不同视图。
* **视图状态 (View States)**：
    1.  **初始/上传态 (Upload)**:
        *   展示 Slogan 和 `PhotoUploader`。
        *   用户上传图片后，触发 AI 分析，状态切换至“人设选择”。
    2.  **人设选择态 (Persona Selection)**:
        *   展示 `PetCard` (识别结果预览)。
        *   展示 `PersonaSelector` 供用户选择。
        *   点击生成后，状态切换至“结果展示”。
    3.  **结果与编辑态 (Result & Edit)**:
        *   展示 `ResultCarousel` 和 `MemeEditor`。
        *   提供 `ExportPanel` 进行保存/分享。
        *   提供“重做”或“返回”按钮回到初始状态。

* **核心逻辑集成**：
    *   监听 `useMemeGenerator` store 中的 `step` 或 `status` 字段。
    *   **Action**: `setCurrentImage`, `setPersona`, `generateMeme`, `reset`.

### 3.2 创作历史 (History)
* **路径**：`app/history/page.tsx`
* **功能**：展示用户过往生成的梗图记录。
* **核心组件**：
    *   作品网格/列表。
    *   点击可查看大图或重新编辑（可选）。

### 3.3 个人中心 (Profile)
* **路径**：`app/profile/page.tsx`
* **功能**：用户资料、会员状态、以及其他设置。
* **核心组件**：
    *   `Avatar` (用户头像)
    *   `CreditDisplay` (剩余点数/会员状态)
    *   菜单列表（设置、帮助、关于）。
* **逻辑集成**：
    *   `useUserStore` 获取用户信息。

---

## 4. 路由守卫与状态管理 (Guards & State)

由于核心流程在单页内完成，重点在于**状态的持久化与重置**：

*   **状态重置**：当用户离开首页（如切换到 History 或 Profile）再切回来时，需要决定是保留当前创作进度，还是重置回上传页？
    *   *策略建议*：默认保留 `useMemeGenerator` 状态。如果用户希望开始新创作，在结果页提供“开始新的”按钮触发 store 的 `reset` 方法。
*   **加载状态**：在 AI 分析和图片生成过程中，需展示全局或局部 Loading 遮罩，防止用户误操作。

---

## 5. 任务清单 (Task List)

### 5.1 基础架构
- [ ] 配置 `app/layout.tsx` (包含 `MobileTabBar` 的布局实现)
- [ ] 确保 `MobileTabBar` 能正确路由到 `/`, `/history`, `/profile`

### 5.2 首页 (核心流程)
- [ ] 实现 `app/page.tsx` 的状态机逻辑 (Switch case based on step)
- [ ] 集成 **Upload View**: `PhotoUploader` & `usePhotoUpload`
- [ ] 集成 **Persona View**: `PetCard` & `PersonaSelector`
- [ ] 集成 **Result View**: `ResultCarousel`, `MemeEditor` & `ExportPanel`
- [ ] 调试全流程串联：上传 -> 分析完成 -> 选择人设 -> 生成 -> 结果展示

### 5.3 其他页面
- [ ] 实现 `app/history/page.tsx` (空状态 + 列表展示)
- [ ] 实现 `app/profile/page.tsx` (用户信息 + 简单设置)