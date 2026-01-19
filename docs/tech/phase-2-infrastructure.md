# 第二阶段：环境搭建与全局配置（Infrastructure）

| **属性** | **详情** |
| --- | --- |
| **状态** | `待开发` |
| **最后更新** | 2026-01-19 |
| **前置条件** | 第一阶段（类型定义）完成 |

---

## 概述

本阶段目标是完成项目的基础设施搭建，包括安装必要依赖、配置全局样式系统、创建布局组件。完成后项目将具备完整的 UI 基础架构，可以开始组件开发。

---

## 任务清单

### 2.1 项目依赖安装

#### 任务 2.1.1：安装 UI 组件库依赖

**目标**：安装 Radix UI 无障碍基础组件

```bash
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  @radix-ui/react-select @radix-ui/react-tabs \
  @radix-ui/react-toast @radix-ui/react-tooltip
```

**验收标准**：
- [ ] 所有 Radix UI 组件安装成功
- [ ] 无版本冲突警告

---

#### 任务 2.1.2：安装动画与交互依赖

**目标**：安装动画库和滑动组件

```bash
pnpm add framer-motion swiper lucide-react
```

**验收标准**：
- [ ] framer-motion 版本 ≥ 11.0.0
- [ ] swiper 版本 ≥ 11.0.0
- [ ] lucide-react 图标可正常导入

---

#### 任务 2.1.3：安装状态管理依赖

**目标**：安装状态管理和数据请求库

```bash
pnpm add zustand @tanstack/react-query
```

**验收标准**：
- [ ] zustand 版本 ≥ 5.0.0
- [ ] TanStack Query 版本 ≥ 5.0.0

---

#### 任务 2.1.4：安装表单与校验依赖

**目标**：安装表单处理和数据校验库

```bash
pnpm add react-hook-form zod @hookform/resolvers
```

**验收标准**：
- [ ] react-hook-form 版本 ≥ 7.50.0
- [ ] zod 版本 ≥ 3.23.0

---

#### 任务 2.1.5：安装工具函数依赖

**目标**：安装 CSS 类名合并工具

```bash
pnpm add clsx tailwind-merge
```

**验收标准**：
- [ ] clsx 和 tailwind-merge 安装成功

---

### 2.2 全局样式与主题配置

#### 任务 2.2.1：创建 CSS 工具函数

**目标**：创建 `cn()` 工具函数用于合并 Tailwind 类名

**文件**：`lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**验收标准**：
- [ ] `cn()` 函数可正确合并类名
- [ ] 支持条件类名：`cn("base", condition && "active")`

---

#### 任务 2.2.2：定义设计令牌（Design Tokens）

**目标**：在 `app/globals.css` 中定义完整的设计系统变量

**文件**：`app/globals.css`

```css
@import "tailwindcss";

/* ============================================
   设计令牌 - Design Tokens
   ============================================ */

:root {
  /* 颜色 - 亮色模式 */
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;

  --card: 0 0% 100%;
  --card-foreground: 0 0% 9%;

  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 9%;

  --primary: 262 83% 58%;
  --primary-foreground: 0 0% 100%;

  --secondary: 0 0% 96%;
  --secondary-foreground: 0 0% 9%;

  --muted: 0 0% 96%;
  --muted-foreground: 0 0% 45%;

  --accent: 0 0% 96%;
  --accent-foreground: 0 0% 9%;

  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;

  --border: 0 0% 90%;
  --input: 0 0% 90%;
  --ring: 262 83% 58%;

  /* 圆角 */
  --radius: 0.5rem;

  /* 间距 */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* 动画时长 */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
}

/* 暗色模式 */
@media (prefers-color-scheme: dark) {
  :root {
    --background: 0 0% 4%;
    --foreground: 0 0% 93%;

    --card: 0 0% 7%;
    --card-foreground: 0 0% 93%;

    --popover: 0 0% 7%;
    --popover-foreground: 0 0% 93%;

    --primary: 262 83% 65%;
    --primary-foreground: 0 0% 100%;

    --secondary: 0 0% 15%;
    --secondary-foreground: 0 0% 93%;

    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 64%;

    --accent: 0 0% 15%;
    --accent-foreground: 0 0% 93%;

    --destructive: 0 62% 50%;
    --destructive-foreground: 0 0% 100%;

    --border: 0 0% 18%;
    --input: 0 0% 18%;
    --ring: 262 83% 65%;
  }
}

/* Tailwind 主题映射 */
@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 4px);
  --radius-xl: calc(var(--radius) + 8px);

  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

/* 全局基础样式 */
* {
  border-color: hsl(var(--border));
}

body {
  background: hsl(var(--background));
  color: hsl(var(--foreground));
  font-family: var(--font-sans), system-ui, sans-serif;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}

/* 焦点样式 */
:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

**验收标准**：
- [ ] 亮色/暗色模式切换正常
- [ ] 所有颜色变量可通过 Tailwind 类名使用（如 `bg-primary`）
- [ ] 圆角变量可通过 `rounded-md` 等类名使用

---

#### 任务 2.2.3：配置字体

**目标**：优化中文字体显示，配置 Google Fonts

**文件**：`app/layout.tsx`

```typescript
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "宠灵感 · PetSoul",
  description: "AI 驱动的宠物内心戏生成器",
  keywords: ["宠物", "AI", "梗图", "内心戏"],
  authors: [{ name: "PetSoul Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

**验收标准**：
- [ ] 页面语言设置为 `zh-CN`
- [ ] metadata 包含完整的 SEO 信息
- [ ] viewport 针对移动端优化

---

### 2.3 布局组件开发

#### 任务 2.3.1：创建应用 Shell 布局

**目标**：创建适配移动端的应用外壳布局

**文件**：`components/layout/app-shell.tsx`

```typescript
"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AppShell({
  children,
  header,
  footer,
  className,
}: AppShellProps) {
  return (
    <div className={cn("flex min-h-screen flex-col", className)}>
      {header && (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {header}
        </header>
      )}
      <main className="flex-1">{children}</main>
      {footer && (
        <footer className="border-t bg-background">
          {footer}
        </footer>
      )}
    </div>
  );
}
```

**验收标准**：
- [ ] Header 支持 sticky 定位
- [ ] 主内容区自适应高度
- [ ] Footer 固定在底部

---

#### 任务 2.3.2：创建顶部导航栏组件

**目标**：创建移动端友好的顶部导航栏

**文件**：`components/layout/header.tsx`

```typescript
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
}

export function Header({
  title,
  leftSlot,
  rightSlot,
  className,
}: HeaderProps) {
  return (
    <div
      className={cn(
        "flex h-14 items-center justify-between px-4",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {leftSlot}
      </div>
      {title && (
        <h1 className="text-lg font-semibold">{title}</h1>
      )}
      <div className="flex items-center gap-2">
        {rightSlot}
      </div>
    </div>
  );
}
```

**验收标准**：
- [ ] 支持左右插槽
- [ ] 高度固定 56px (h-14)
- [ ] 标题居中显示

---

#### 任务 2.3.3：创建底部操作栏组件

**目标**：创建固定在底部的操作栏，用于主要 CTA

**文件**：`components/layout/bottom-bar.tsx`

```typescript
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BottomBarProps {
  children: ReactNode;
  className?: string;
}

export function BottomBar({ children, className }: BottomBarProps) {
  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t bg-background p-4",
        "pb-[calc(1rem+env(safe-area-inset-bottom))]",
        className
      )}
    >
      {children}
    </div>
  );
}
```

**验收标准**：
- [ ] 固定在屏幕底部
- [ ] 适配 iPhone 底部安全区域
- [ ] z-index 层级正确

---

#### 任务 2.3.4：创建页面容器组件

**目标**：创建统一的页面内容容器

**文件**：`components/layout/container.tsx`

```typescript
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** 是否启用最大宽度限制 */
  maxWidth?: boolean;
}

export function Container({
  children,
  className,
  maxWidth = true,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4",
        maxWidth && "max-w-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
```

**验收标准**：
- [ ] 默认最大宽度 512px (max-w-lg)
- [ ] 水平居中
- [ ] 左右内边距 16px

---

#### 任务 2.3.5：创建布局组件导出索引

**目标**：统一导出所有布局组件

**文件**：`components/layout/index.ts`

```typescript
export { AppShell } from "./app-shell";
export { Header } from "./header";
export { BottomBar } from "./bottom-bar";
export { Container } from "./container";
```

**验收标准**：
- [ ] 可通过 `@/components/layout` 导入所有布局组件

---

### 2.4 Provider 配置

#### 任务 2.4.1：创建 React Query Provider

**目标**：配置 TanStack Query 全局 Provider

**文件**：`components/providers/query-provider.tsx`

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 分钟
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**验收标准**：
- [ ] QueryClient 配置合理的默认值
- [ ] 客户端组件标记正确

---

#### 任务 2.4.2：创建 Toast Provider

**目标**：配置 Radix Toast 全局 Provider

**文件**：`components/providers/toast-provider.tsx`

```typescript
"use client";

import * as Toast from "@radix-ui/react-toast";
import { ReactNode } from "react";

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider swipeDirection="right">
      {children}
      <Toast.Viewport className="fixed bottom-0 right-0 z-[100] flex max-w-[100vw] flex-col gap-2 p-4 sm:max-w-[420px]" />
    </Toast.Provider>
  );
}
```

**验收标准**：
- [ ] Toast 从右侧滑入
- [ ] Viewport 位于屏幕右下角

---

#### 任务 2.4.3：创建根 Provider 组合

**目标**：组合所有 Provider 为单一入口

**文件**：`components/providers/index.tsx`

```typescript
"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { ToastProvider } from "./toast-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </QueryProvider>
  );
}
```

**验收标准**：
- [ ] Provider 嵌套顺序正确
- [ ] 可通过 `<Providers>` 包裹应用

---

#### 任务 2.4.4：集成 Provider 到 Layout

**目标**：在根 Layout 中集成 Providers

**文件**：`app/layout.tsx`（更新）

```typescript
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

// ... 字体和 metadata 配置保持不变 ...

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**验收标准**：
- [ ] Providers 正确包裹 children
- [ ] 页面渲染无报错

---

## 目录结构

完成本阶段后，项目目录结构如下：

```
pet-soul/
├── app/
│   ├── globals.css          # 全局样式与设计令牌
│   ├── layout.tsx           # 根布局（含 Providers）
│   ├── page.tsx             # 首页
│   └── favicon.ico
├── components/
│   ├── layout/
│   │   ├── index.ts         # 布局组件导出
│   │   ├── app-shell.tsx    # 应用外壳
│   │   ├── header.tsx       # 顶部导航
│   │   ├── bottom-bar.tsx   # 底部操作栏
│   │   └── container.tsx    # 页面容器
│   └── providers/
│       ├── index.tsx        # Provider 组合
│       ├── query-provider.tsx
│       └── toast-provider.tsx
├── lib/
│   └── utils.ts             # 工具函数（cn）
└── package.json
```

---

## 依赖版本汇总

本阶段安装的依赖：

```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0",
    "@radix-ui/react-tooltip": "^1.1.0",
    "framer-motion": "^11.0.0",
    "swiper": "^11.0.0",
    "lucide-react": "^0.400.0",
    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.3.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

---

## 验收检查清单

- [ ] 所有依赖安装完成，`pnpm install` 无报错
- [ ] `pnpm dev` 启动正常，无控制台错误
- [ ] 亮色/暗色模式切换正常
- [ ] 布局组件可正常渲染
- [ ] TypeScript 类型检查通过（`pnpm build`）

---

## 下一阶段

完成本阶段后，进入 **第三阶段：组件库与原子开发**，开发基础 UI 组件（Button、Input、Card 等）。
