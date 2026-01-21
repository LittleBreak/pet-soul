# 第一阶段技术方案：MVP 版

| **属性** | **详情** |
| --- | --- |
| **状态** | `草稿` |
| **阶段** | 第一阶段（MVP） |
| **最后更新** | 2026-01-19 |
| **关联文档** | [技术框架](./frontend-tech-framework.md) · [PRD](../prd-zh.md) |

---

## 1. MVP 功能范围

### 1.1 P0 功能清单

| 模块 | PRD 需求 | 功能描述 |
| --- | --- | --- |
| **快拍解码** | FR.1.1 | 照片上传（相册/拍摄，JPG/PNG/HEIC，最大 10MB） |
| | FR.1.2 | AI 图像识别（品种、表情、动作、环境、物体） |
| | FR.1.3 | 内心戏生成（3 个版本供选择） |
| | FR.1.4 | 生成结果展示（左右滑动切换版本） |
| **性格实验室** | FR.2.1 | 6 种基础人设模板 |
| | FR.2.2 | 人设选择器（默认「高冷主子」） |
| **一键梗图** | FR.3.1 | 梗图生成（文案自动排版到图片） |
| | FR.3.4 | 产品水印 |
| **社交分享** | FR.4.1 | 一键分享（微信/朋友圈/小红书/微博） |
| | FR.4.2 | 图片保存到本地相册 |
| **使用限制** | - | 免费用户每日 5 次限制 |

### 1.2 P0 边界情况

| 场景 | 预期行为 |
| --- | --- |
| 未检测到宠物 | 提示「未检测到宠物」，引导重新上传 |
| 图片过大/格式不支持 | 提示具体原因，引导压缩或更换格式 |
| API 调用失败/超时 | 友好错误提示 + 重试按钮 |
| 生成内容包含不当言论 | 内容过滤，自动替换或重新生成 |
| 免费用户达到每日上限 | 提示已达上限，引导次日再来 |

### 1.3 P0 埋点事件

| 事件名称 | 触发条件 | 属性 |
| --- | --- | --- |
| `photo_uploaded` | 用户上传/拍摄照片 | source, file_size |
| `persona_selected` | 用户选择宠物人设 | persona_type |
| `content_generated` | AI 生成内心戏完成 | generation_time_ms, pet_type, persona |
| `content_shared` | 用户点击分享 | platform, content_type |

### 1.4 非功能需求

| 类型 | 要求 |
| --- | --- |
| **性能** | 图片上传后 3 秒内返回生成结果；梗图生成 1 秒内完成 |
| **安全** | 图片 24 小时内自动删除；API 密钥不暴露给前端 |
| **内容安全** | 生成内容经过敏感词过滤 |

---

## 2. 技术架构

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         PWA 客户端                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ PhotoUploader│  │PersonaSelect│  │ MemeEditor (Canvas)    │  │
│  │ 图片上传     │  │ 人设选择    │  │ 梗图编辑器              │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │MonologueSwiper│ │ ShareSheet │  │ UsageLimitBanner        │  │
│  │ 内心戏滑动   │  │ 分享面板    │  │ 使用次数提示            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js API Routes                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ /api/generate│  │/api/upload  │  │ /api/usage              │  │
│  │ AI 生成接口  │  │ 图片上传    │  │ 使用次数管理            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         外部服务                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Claude API  │  │Cloudflare R2│  │ 敏感词过滤               │  │
│  │ Vision+生成 │  │ 临时图片存储 │  │ 内容安全                │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 核心用户流程（单页状态机）

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  初始态  │ →  │ 上传态    │ →  │ 人设态    │ →  │ 结果态    │ →  │ 编辑态    │
│          │    │          │    │          │    │          │    │          │
│ 入口引导 │    │ 拍照/相册 │    │ 6种人设  │    │ 3个版本  │    │ 梗图生成 │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │               │
     ▼               ▼               ▼               ▼               ▼
  检查限额      图片处理压缩     记录埋点       调用 AI API     生成带水印图
```

### 2.3 项目结构

```
pet-soul/
├── app/
│   ├── page.tsx                    # 聚合首页（单页多状态：上传 -> 人设 -> 结果 -> 编辑）
│   ├── design-system/page.tsx      # 设计系统/组件预览
│   ├── api/
│   │   ├── generate/route.ts       # AI 生成接口
│   │   ├── upload/route.ts         # 图片上传接口
│   │   └── usage/route.ts          # 使用次数接口
│   ├── layout.tsx
│   └── manifest.ts                 # PWA manifest
│
├── components/
│   ├── business/                   # 业务逻辑组件
│   ├── shared/                     # 共享组件（图标、Logo等）
│   └── ui/                         # 基础 UI 组件 (shadcn/ui)
│
├── lib/
│   ├── hooks/                      # 业务 Hooks (use-ai-analysis 等)
│   ├── stores/                     # 状态管理 (use-app-store, use-user-store)
│   ├── utils.ts                    # 工具函数
│   ├── constants/                  # 常量配置
│   ├── validations/                # Zod schemas
│   └── mocks/                      # Mock 数据
│
└── types/                          # TypeScript 类型
```

---

## 3. 核心模块方案

### 3.1 图片上传模块（FR.1.1）

| 需求 | 技术方案 |
| --- | --- |
| 相册选择/拍照 | `react-dropzone` + `<input capture="environment">` |
| HEIC 格式支持 | `heic2any` 库转换为 JPEG |
| 客户端压缩 | `browser-image-compression`，> 2MB 压缩至 1MB |
| 格式/大小校验 | Zod schema 验证，最大 10MB |

**处理流程：** 格式检测 → HEIC转换 → 大小压缩 → 生成预览 → 转Base64

### 3.2 人设选择模块（FR.2.1, FR.2.2）

| 需求 | 技术方案 |
| --- | --- |
| 6 种基础人设 | 静态配置 `PERSONAS[]`，含 prompt 模板 |
| 默认人设 | 默认选中「高冷主子」 |
| 人设切换 | Zustand store 管理选中状态 |

**基础人设：** 高冷总裁、碎碎念大妈、文艺青年、热血少年、毒舌吐槽、卑微打工人

### 3.3 AI 生成模块（FR.1.2, FR.1.3）

| 需求 | 技术方案 |
| --- | --- |
| 图像识别 | Claude API Vision，识别品种/表情/动作/环境 |
| 内心戏生成 | 图像信息 + 人设 prompt → 生成 3 个版本 |
| 响应格式 | JSON 结构化输出，Zod 验证 |
| 内容安全 | 敏感词过滤 + 结果校验 |

**API 端点：** `POST /api/generate`
- 输入：imageBase64, personaId
- 输出：monologues[], petType, emotion, generationTime

### 3.4 结果展示模块（FR.1.4）

| 需求 | 技术方案 |
| --- | --- |
| 3 版本展示 | Swiper 组件，支持触摸滑动 |
| 版本切换 | 分页指示器 + 滑动切换 |
| 选中状态 | Zustand store 管理 selectedIndex |

### 3.5 梗图编辑模块（FR.3.1, FR.3.4）

| 需求 | 技术方案 |
| --- | --- |
| Canvas 编辑器 | Konva.js + react-konva |
| 文字排版 | Text 组件，支持拖拽定位 |
| 水印叠加 | 固定位置 Layer，不可移除（MVP） |
| 图片导出 | `stage.toDataURL()` 导出 JPEG |

**图层结构：** Image Layer → Text Layer → Watermark Layer

### 3.6 分享模块（FR.4.1, FR.4.2）

| 需求 | 技术方案 |
| --- | --- |
| 一键分享 | Web Share API（`navigator.share`） |
| 保存相册 | `<a download>` + Data URL |
| 降级处理 | 不支持时提示手动保存后分享 |

**分享平台：** 微信好友、朋友圈、微博、小红书

### 3.7 使用限制模块

| 需求 | 技术方案 |
| --- | --- |
| 每日 5 次 | localStorage 存储 {count, date} |
| 次日重置 | 检测日期变化自动重置 |
| 状态展示 | UsageLimitBanner 组件 |

**MVP 简化：** 使用 localStorage 管理，不依赖后端认证

### 3.8 状态管理

| Store | 职责 |
| --- | --- |
| `use-app-store` | 图片状态、人设选择、生成结果、梗图编辑、流程步骤控制 |
| `use-user-store` | 用户信息、宠物档案、每日免费额度（Quota）管理 |

**状态分层：**
- Server State：TanStack Query（API 请求与缓存）
- Client State：Zustand（全局跨组件业务状态）
- UI State：React useState（组件内局部交互状态）

---

## 4. API 设计

### 4.1 生成接口

```
POST /api/generate
```

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| **请求** | | |
| imageBase64 | string | 图片 Base64 编码 |
| personaId | string | 人设 ID |
| **响应** | | |
| monologues | array | 3 个内心戏版本 |
| petType | string | 宠物类型（cat/dog/other） |
| petBreed | string | 宠物品种 |
| emotion | string | 主要情绪 |
| generationTime | number | 生成耗时（ms） |

### 4.2 错误码

| 错误 | HTTP 状态码 | 说明 |
| --- | --- | --- |
| NO_PET_DETECTED | 400 | 未检测到宠物 |
| INVALID_FORMAT | 400 | 图片格式不支持 |
| FILE_TOO_LARGE | 400 | 图片过大 |
| GENERATION_FAILED | 500 | AI 生成失败 |
| RATE_LIMITED | 429 | 请求过于频繁 |

---

## 5. 开发顺序

| 阶段 | 任务 | 依赖 |
| --- | --- | --- |
| **1** | 项目初始化、安装依赖 | 无 |
| **2** | 基础 UI 组件（Button、Card、Toast） | 无 |
| **3** | 图片上传模块 | UI 组件 |
| **4** | 人设选择模块 | UI 组件 |
| **5** | AI 生成 API | ANTHROPIC_API_KEY |
| **6** | 结果展示模块 | 生成 API |
| **7** | 梗图编辑器（Canvas） | 结果模块 |
| **8** | 分享模块 | 梗图编辑器 |
| **9** | 使用限制（localStorage） | 无 |
| **10** | 埋点系统 | 无 |
| **11** | PWA 配置 | 无 |
| **12** | 测试 & 优化 | 全部完成 |

---

## 6. 环境变量

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# AI Service
ANTHROPIC_API_KEY=sk-ant-xxx

# Analytics (可选)
NEXT_PUBLIC_MIXPANEL_TOKEN=xxx
```

---

## 7. MVP 依赖清单

```json
{
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",

    "@radix-ui/react-dialog": "^1.1.0",
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

    "@anthropic-ai/sdk": "^0.30.0",

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

## 8. 文档索引

| 文档 | 内容 |
| --- | --- |
| [frontend-tech-framework.md](./frontend-tech-framework.md) | 技术选型概览 |
| [init-dev-order.md](./init-dev-order.md) | 开发顺序指南 |
