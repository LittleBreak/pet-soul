# 技术评估文档：宠灵感 · PetSoul

| **属性** | **详情** |
| --- | --- |
| **状态** | `草稿` |
| **最后更新** | 2026-01-19 |

---

## 1. 技术架构概览

基于 PRD 需求，采用 **Next.js 全栈架构**，前端使用 React Server Components，后端使用 API Routes，部署为 PWA 应用。

```
┌─────────────────────────────────────────────────────────────────┐
│                        客户端 (PWA)                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ 图片上传组件 │  │ 人设选择器  │  │ 梗图编辑器 (Canvas)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js API Routes                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ /api/upload │  │ /api/generate│ │ /api/share              │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        外部服务层                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Claude API  │  │ 云存储 (R2) │  │ 内容安全审核            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 前端技术选型

### 2.1 核心框架

| 技术 | 版本 | 选型理由 |
| --- | --- | --- |
| **Next.js** | 16.x | 项目已采用，支持 App Router、RSC、API Routes |
| **React** | 19.x | 最新版本，支持 Server Components |
| **TypeScript** | 5.9 | 项目已采用，严格模式 |
| **Tailwind CSS** | 4.x | 项目已采用，快速 UI 开发 |

### 2.2 UI 组件与交互

| 技术 | 用途 | 选型理由 |
| --- | --- | --- |
| **Radix UI** | 无障碍基础组件 | 无样式、可组合、符合 WAI-ARIA |
| **Framer Motion** | 动画效果 | 流畅的手势和过渡动画 |
| **Swiper** | 内心戏版本滑动切换 | 成熟的触摸滑动库 |
| **Lucide React** | 图标库 | 轻量、可定制 |

### 2.3 图片处理

| 技术 | 用途 | 选型理由 |
| --- | --- | --- |
| **react-dropzone** | 图片上传组件 | 支持拖拽、点击、相册选择 |
| **browser-image-compression** | 客户端图片压缩 | 减少上传体积，加快速度 |
| **Konva.js** | Canvas 梗图编辑器 | 文字排版、滤镜、导出图片 |

### 2.4 状态管理与数据获取

| 技术 | 用途 | 选型理由 |
| --- | --- | --- |
| **Zustand** | 客户端状态管理 | 轻量、简单、支持 TypeScript |
| **TanStack Query** | 服务端状态/缓存 | 数据获取、缓存、重试机制 |
| **React Hook Form** | 表单处理 | 性能优异、易于验证 |
| **Zod** | 数据校验 | 类型安全的 schema 验证 |

### 2.5 PWA 支持

| 技术 | 用途 | 选型理由 |
| --- | --- | --- |
| **next-pwa** | PWA 配置 | 与 Next.js 深度集成 |
| **workbox** | Service Worker | 离线缓存、后台同步 |

### 2.6 前端依赖清单

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",

    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0",
    "@radix-ui/react-tooltip": "^1.1.0",

    "framer-motion": "^11.0.0",
    "swiper": "^11.0.0",
    "lucide-react": "^0.400.0",

    "react-dropzone": "^14.0.0",
    "browser-image-compression": "^2.0.0",
    "konva": "^9.0.0",
    "react-konva": "^18.0.0",

    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.3.0",

    "next-pwa": "^5.6.0",

    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "typescript": "^5.9.0",
    "@types/react": "^19.0.0",
    "@types/node": "^22.0.0"
  }
}
```

---

## 3. 后端技术选型

### 3.1 API 框架

| 技术 | 用途 | 选型理由 |
| --- | --- | --- |
| **Next.js API Routes** | 后端 API | 统一技术栈、部署简单 |
| **Zod** | 请求/响应校验 | 类型安全、自动推导类型 |

### 3.2 AI 服务

| 技术 | 用途 | 选型理由 |
| --- | --- | --- |
| **Anthropic Claude API** | 多模态图像识别 + 文案生成 | 识别准确、中文表达自然、成本可控 |
| **@anthropic-ai/sdk** | Claude SDK | 官方 SDK，类型完善 |

> **备选方案:** OpenAI GPT-4o，需评估：
> - 识别准确度对比
> - 中文生成质量对比
> - API 响应速度对比
> - 成本对比（每 1000 次调用）

### 3.3 图片处理

| 技术 | 用途 | 选型理由 |
| --- | --- | --- |
| **Sharp** | 服务端图片处理 | 高性能、支持多格式转换 |
| **@vercel/og** | 动态图片生成 | Edge Runtime 支持、适合梗图生成 |

### 3.4 数据存储

| 技术 | 用途 | 选型理由 |
| --- | --- | --- |
| **Cloudflare R2** | 临时图片存储 | S3 兼容、无出口费用、支持 24h 自动过期 |
| **Upstash Redis** | 用户限额/缓存 | Serverless Redis、边缘节点 |
| **Drizzle ORM** | 数据库 ORM | 类型安全、轻量、性能优异 |
| **Neon / PlanetScale** | PostgreSQL/MySQL | Serverless 数据库，按用量计费 |

### 3.5 认证与安全

| 技术 | 用途 | 选型理由 |
| --- | --- | --- |
| **NextAuth.js v5** | 用户认证 | 支持微信登录、与 Next.js 深度集成 |
| **微信开放平台 SDK** | 微信登录/分享 | 国内社交平台必需 |
| **Upstash Ratelimit** | API 限流 | 基于 Redis 的限流方案 |

### 3.6 内容安全

| 技术 | 用途 | 选型理由 |
| --- | --- | --- |
| **腾讯云内容安全** | 图片/文本审核 | 国内合规、识别准确 |
| **自定义敏感词库** | 文本过滤 | 配合 AI 生成内容过滤 |

### 3.7 后端依赖清单

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.30.0",

    "sharp": "^0.33.0",
    "@vercel/og": "^0.6.0",

    "@aws-sdk/client-s3": "^3.500.0",
    "@aws-sdk/s3-request-presigner": "^3.500.0",

    "@upstash/redis": "^1.28.0",
    "@upstash/ratelimit": "^2.0.0",

    "drizzle-orm": "^0.35.0",
    "@neondatabase/serverless": "^0.10.0",

    "next-auth": "^5.0.0",

    "nanoid": "^5.0.0",
    "date-fns": "^4.0.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.26.0"
  }
}
```

---

## 4. 基础设施与部署

### 4.1 部署平台

| 服务 | 用途 | 选型理由 |
| --- | --- | --- |
| **Vercel** | 应用部署 | Next.js 官方平台、全球 CDN、边缘函数 |
| **Cloudflare** | CDN / R2 存储 | 国内加速、无出口费用 |

### 4.2 监控与分析

| 服务 | 用途 | 选型理由 |
| --- | --- | --- |
| **Vercel Analytics** | 性能监控 | 内置集成、Core Web Vitals |
| **Sentry** | 错误监控 | 实时错误追踪、性能监控 |
| **Mixpanel / 神策** | 用户行为分析 | 埋点分析、漏斗转化 |

### 4.3 基础设施依赖

```json
{
  "dependencies": {
    "@vercel/analytics": "^1.2.0",
    "@vercel/speed-insights": "^1.0.0",
    "@sentry/nextjs": "^8.0.0"
  }
}
```

---

## 5. 开发工具链

### 5.1 代码质量

| 工具 | 用途 |
| --- | --- |
| **ESLint** | 代码检查 |
| **Prettier** | 代码格式化 |
| **Husky** | Git Hooks |
| **lint-staged** | 暂存文件检查 |
| **commitlint** | 提交信息规范 |

### 5.2 测试工具

| 工具 | 用途 |
| --- | --- |
| **Vitest** | 单元测试 |
| **Playwright** | E2E 测试 |
| **MSW** | API Mock |

### 5.3 开发依赖清单

```json
{
  "devDependencies": {
    "eslint": "^9.0.0",
    "eslint-config-next": "^16.0.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.6.0",

    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "@commitlint/cli": "^19.0.0",
    "@commitlint/config-conventional": "^19.0.0",

    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "playwright": "^1.45.0",
    "msw": "^2.3.0"
  }
}
```

---

## 6. 完整依赖汇总

### package.json

```json
{
  "name": "pet-soul",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --fix",
    "format": "prettier --write .",
    "test": "vitest",
    "test:e2e": "playwright test",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
    "prepare": "husky"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",

    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0",
    "@radix-ui/react-tooltip": "^1.1.0",

    "framer-motion": "^11.0.0",
    "swiper": "^11.0.0",
    "lucide-react": "^0.400.0",

    "react-dropzone": "^14.0.0",
    "browser-image-compression": "^2.0.0",
    "konva": "^9.0.0",
    "react-konva": "^18.0.0",

    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.3.0",

    "next-pwa": "^5.6.0",

    "@anthropic-ai/sdk": "^0.30.0",

    "sharp": "^0.33.0",
    "@vercel/og": "^0.6.0",

    "@aws-sdk/client-s3": "^3.500.0",
    "@aws-sdk/s3-request-presigner": "^3.500.0",

    "@upstash/redis": "^1.28.0",
    "@upstash/ratelimit": "^2.0.0",

    "drizzle-orm": "^0.35.0",
    "@neondatabase/serverless": "^0.10.0",

    "next-auth": "^5.0.0",

    "@vercel/analytics": "^1.2.0",
    "@vercel/speed-insights": "^1.0.0",
    "@sentry/nextjs": "^8.0.0",

    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "nanoid": "^5.0.0",
    "date-fns": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.9.0",
    "@types/react": "^19.0.0",
    "@types/node": "^22.0.0",

    "eslint": "^9.0.0",
    "eslint-config-next": "^16.0.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.6.0",

    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "@commitlint/cli": "^19.0.0",
    "@commitlint/config-conventional": "^19.0.0",

    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "playwright": "^1.45.0",
    "msw": "^2.3.0",

    "drizzle-kit": "^0.26.0"
  }
}
```

---

## 7. 环境变量配置

```env
# App
NEXT_PUBLIC_APP_URL=https://petsoul.app

# AI Service
ANTHROPIC_API_KEY=sk-ant-xxx

# Database
DATABASE_URL=postgresql://xxx

# Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# Storage (Cloudflare R2)
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx
R2_BUCKET_NAME=pet-soul-uploads

# Auth
AUTH_SECRET=xxx
AUTH_WECHAT_APP_ID=xxx
AUTH_WECHAT_APP_SECRET=xxx

# Content Security (腾讯云)
TENCENT_SECRET_ID=xxx
TENCENT_SECRET_KEY=xxx

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## 8. 技术风险与建议

| 风险 | 影响 | 建议 |
| --- | --- | --- |
| Claude API 国内访问延迟 | 影响 3 秒响应目标 | 使用代理或考虑国内多模态 API（如通义千问） |
| 微信分享需要 JSSDK 配置 | 分享功能受限 | 申请公众号、配置安全域名 |
| Vercel 国内访问速度 | 用户体验下降 | 考虑 Cloudflare 代理或国内部署 |
| 图片处理耗时 | 可能超时 | 使用 Edge Function + 流式响应 |

---

## 9. MVP 最小依赖集

如果需要快速启动 MVP，可精简为：

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@anthropic-ai/sdk": "^0.30.0",
    "zustand": "^5.0.0",
    "zod": "^3.23.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.400.0",
    "konva": "^9.0.0",
    "react-konva": "^18.0.0"
  }
}
```

MVP 阶段可暂时使用：
- localStorage 替代 Redis（用户限额）
- 本地 Base64 替代云存储（图片处理）
- 简单 prompt 替代完整内容审核
