# 前端技术框架：宠灵感 · PetSoul

| **属性** | **详情** |
| --- | --- |
| **状态** | `草稿` |
| **最后更新** | 2026-01-19 |
| **关联文档** | [PRD](../prd-zh.md)  |

---

## 1. 技术选型

### 1.1 核心框架

| 分类 | 技术 | 版本 | 选型理由 |
| --- | --- | --- | --- |
| **框架** | Next.js | 16.x | App Router + RSC + API Routes，全栈一体 |
| **UI** | React | 19.x | Server Components，性能优异 |
| **语言** | TypeScript | 5.9 | 严格模式，类型安全 |
| **样式** | Tailwind CSS | 4.x | 原子化 CSS，快速开发 |

### 1.2 UI 组件库

| 技术 | 用途 |
| --- | --- |
| **Radix UI** | 无障碍基础组件（Dialog、Select、Toast 等） |
| **Framer Motion** | 动画效果、手势交互 |
| **Swiper** | 内心戏版本滑动切换 |
| **Lucide React** | 图标库 |

### 1.3 图片处理

| 技术 | 用途 |
| --- | --- |
| **react-dropzone** | 图片上传（拖拽 + 相册选择 + 拍照） |
| **browser-image-compression** | 客户端图片压缩（减少上传体积） |
| **heic2any** | HEIC → JPEG 格式转换 |
| **Konva.js** | Canvas 梗图编辑器（文字排版、滤镜、导出） |

### 1.4 状态管理

| 技术 | 用途 |
| --- | --- |
| **Zustand** | 客户端状态（上传流程、编辑器状态） |
| **TanStack Query** | 服务端状态（API 缓存、重试、乐观更新） |
| **Zod** | 数据校验（API 响应、表单验证） |

### 1.5 PWA 支持

| 技术 | 用途 |
| --- | --- |
| **next-pwa** | Service Worker 自动生成 |
| **Web App Manifest** | 安装到主屏幕 |

---

## 2. 技术架构

### 2.1 整体架构图

```
┌────────────────────────────────────────────────────────────────┐
│                       PWA 应用层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  图片上传     │  │  人设选择     │  │  梗图编辑器 (Canvas) │  │
│  │  PhotoUploader│  │  PersonaSelect│  │  MemeEditor         │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  /api/upload │  │ /api/generate│  │  /api/user           │  │
│  │  图片上传     │  │  AI 内心戏生成│  │  用户限额管理        │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                       外部服务层                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Claude API  │  │  云存储 (R2) │  │  内容安全审核         │  │
│  │  多模态识别   │  │  临时图片存储 │  │  敏感词过滤          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### 2.2 核心用户流程

```
用户上传照片 → 选择人设 → AI 生成 3 个版本 → 选择最满意的 → 生成梗图 → 分享/保存
     │              │            │                  │              │
     ▼              ▼            ▼                  ▼              ▼
 PhotoUploader  PersonaSelector  MonologueSwiper  MemeEditor   ShareSheet
```

### 2.3 状态管理分层

```
┌─────────────────────────────────────────────────────┐
│              Server State (TanStack Query)          │
│         API 数据、缓存、同步、乐观更新               │
│         - 生成结果、用户信息、使用次数               │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              Client State (Zustand)                 │
│         UI 状态、跨组件状态                         │
│         - 上传图片、选中人设、编辑器状态             │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              Local State (useState)                 │
│         组件内部状态                                │
│         - 表单输入、动画状态、临时 UI               │
└─────────────────────────────────────────────────────┘
```

---

## 3. 项目结构

```
pet-soul/
├── app/                          # Next.js App Router
│   ├── (main)/                   # 主应用路由组
│   │   ├── page.tsx              # 首页（上传入口）
│   │   ├── generate/page.tsx     # 生成页面
│   │   ├── result/page.tsx       # 结果展示页
│   │   └── meme/page.tsx         # 梗图编辑器
│   ├── api/                      # API Routes
│   │   ├── generate/route.ts     # AI 生成接口
│   │   ├── upload/route.ts       # 图片上传接口
│   │   └── user/route.ts         # 用户相关接口
│   ├── layout.tsx                # 根布局
│   └── manifest.ts               # PWA manifest
│
├── components/                   # 组件目录
│   ├── ui/                       # 基础 UI 组件
│   ├── upload/                   # 上传相关组件
│   ├── persona/                  # 人设选择组件
│   ├── result/                   # 结果展示组件
│   ├── meme/                     # 梗图编辑组件
│   └── share/                    # 分享组件
│
├── lib/                          # 工具库
│   ├── api/                      # API 客户端
│   ├── hooks/                    # 自定义 Hooks
│   ├── stores/                   # Zustand stores
│   ├── utils/                    # 工具函数
│   ├── constants/                # 常量配置
│   └── validations/              # Zod schemas
│
└── types/                        # TypeScript 类型定义
```

---

## 4. 核心模块方案

### 4.1 图片上传模块

| 需求 | 技术方案 |
| --- | --- |
| 支持相册选择/拍照 | `react-dropzone` + `<input capture>` |
| 支持 HEIC 格式 | `heic2any` 转换为 JPEG |
| 客户端压缩 | `browser-image-compression`，> 2MB 压缩至 1MB |
| 格式/大小校验 | Zod schema 验证，最大 10MB |

### 4.2 人设系统模块

| 需求 | 技术方案 |
| --- | --- |
| 6 种基础人设 | 静态配置 `PERSONAS[]`，含 prompt 模板 |
| 高级人设（付费） | `isPremium` 标记，UI 显示锁定状态 |
| 默认人设 | 默认选中「高冷主子」 |

### 4.3 AI 生成模块

| 需求 | 技术方案 |
| --- | --- |
| 图像识别 | Claude API Vision，识别品种/表情/动作/环境 |
| 内心戏生成 | 图像信息 + 人设 prompt → 生成 3 个版本 |
| 3 秒响应目标 | 流式响应 + 骨架屏 Loading |
| 内容安全 | 敏感词过滤 + 云端审核 |

### 4.4 梗图编辑器模块

| 需求 | 技术方案 |
| --- | --- |
| 文字排版 | Konva.js `<Text>` 组件，支持拖拽 |
| 5 种字体 | 本地字体文件 + `localFont` 加载 |
| 3 种滤镜 | Konva Filters（原图/复古/黑白） |
| 水印 | Konva `<Group>` 叠加层 |
| 导出图片 | `stage.toDataURL()` / `toBlob()` |

### 4.5 分享模块

| 需求 | 技术方案 |
| --- | --- |
| 微信分享 | JSSDK `wx.shareAppMessage` |
| 通用分享 | Web Share API（`navigator.share`） |
| 保存到相册 | `<a download>` + Data URL |
| 降级方案 | 复制到剪贴板 → 提示用户手动分享 |

---

## 5. 性能方案

| 优化点 | 方案 |
| --- | --- |
| **首屏加载** | Server Components + 流式渲染 |
| **代码分割** | `next/dynamic` 懒加载 MemeEditor、ShareSheet |
| **图片优化** | 客户端压缩 + Next.js Image 优化 |
| **字体加载** | `next/font` + `display: swap` |
| **缓存策略** | TanStack Query 缓存 + PWA 离线缓存 |

---

## 6. 依赖清单

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",

    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-toast": "^1.2.0",

    "framer-motion": "^11.0.0",
    "swiper": "^11.0.0",
    "lucide-react": "^0.400.0",

    "react-dropzone": "^14.0.0",
    "browser-image-compression": "^2.0.0",
    "heic2any": "^0.0.4",
    "konva": "^9.0.0",
    "react-konva": "^18.0.0",

    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "zod": "^3.23.0",

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

## 7. MVP 精简方案

如需快速启动 MVP，可精简为：

| 模块 | MVP 方案 | 完整方案 |
| --- | --- | --- |
| 状态管理 | Zustand only | Zustand + TanStack Query |
| 图片存储 | Base64 本地传输 | Cloudflare R2 云存储 |
| 用户限额 | localStorage | Upstash Redis |
| 内容审核 | 简单敏感词 | 云端审核服务 |
| PWA | 基础 manifest | next-pwa 完整配置 |

**MVP 最小依赖：**

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zustand": "^5.0.0",
    "zod": "^3.23.0",
    "konva": "^9.0.0",
    "react-konva": "^18.0.0",
    "lucide-react": "^0.400.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  }
}
```
