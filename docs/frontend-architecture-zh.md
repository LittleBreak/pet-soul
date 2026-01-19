# 前端技术架构文档：宠灵感 · PetSoul

| **属性** | **详情** |
| --- | --- |
| **状态** | `草稿` |
| **最后更新** | 2026-01-19 |
| **关联文档** | [PRD](./prd-zh.md) · [技术评估](./tech-evaluation-zh.md) |

---

## 目录

1. [技术栈概览](#1-技术栈概览)
2. [项目结构](#2-项目结构)
3. [组件架构](#3-组件架构)
4. [状态管理](#4-状态管理)
5. [API 集成](#5-api-集成)
6. [图片处理系统](#6-图片处理系统)
7. [梗图编辑器](#7-梗图编辑器)
8. [PWA 配置](#8-pwa-配置)
9. [事件埋点系统](#9-事件埋点系统)
10. [错误处理](#10-错误处理)
11. [性能优化](#11-性能优化)
12. [测试策略](#12-测试策略)

---

## 1. 技术栈概览

### 1.1 核心技术

| 分类 | 技术 | 版本 | 用途 |
| --- | --- | --- | --- |
| **框架** | Next.js | 16.x | App Router、RSC、API Routes |
| **UI 库** | React | 19.x | Server/Client Components |
| **语言** | TypeScript | 5.9 | 类型安全、严格模式 |
| **样式** | Tailwind CSS | 4.x | 原子化 CSS |
| **组件** | Radix UI | 1.x | 无障碍基础组件 |
| **动画** | Framer Motion | 11.x | 手势和过渡动画 |
| **状态** | Zustand | 5.x | 客户端状态管理 |
| **数据** | TanStack Query | 5.x | 服务端状态、缓存 |
| **Canvas** | Konva.js | 9.x | 梗图编辑器 |

### 1.2 开发原则

- **Server First**: 优先使用 Server Components，仅在需要交互时使用 Client Components
- **Type Safety**: 所有数据流使用 Zod schema 验证
- **Mobile First**: 移动端优先的响应式设计
- **Progressive Enhancement**: 渐进增强，确保基础功能在低端设备可用

---

## 2. 项目结构

```
pet-soul/
├── app/                          # Next.js App Router
│   ├── (main)/                   # 主应用路由组
│   │   ├── page.tsx              # 首页（上传入口）
│   │   ├── generate/
│   │   │   └── page.tsx          # 生成页面
│   │   ├── result/
│   │   │   └── page.tsx          # 结果展示页
│   │   ├── meme/
│   │   │   └── page.tsx          # 梗图编辑器
│   │   └── profile/
│   │       └── page.tsx          # 宠物档案
│   ├── api/                      # API Routes
│   │   ├── generate/
│   │   │   └── route.ts          # AI 生成接口
│   │   ├── upload/
│   │   │   └── route.ts          # 图片上传接口
│   │   └── user/
│   │       └── route.ts          # 用户相关接口
│   ├── layout.tsx                # 根布局
│   ├── globals.css               # 全局样式
│   └── manifest.ts               # PWA manifest
│
├── components/                   # 组件目录
│   ├── ui/                       # 基础 UI 组件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── toast.tsx
│   │   ├── skeleton.tsx
│   │   └── index.ts
│   ├── upload/                   # 上传相关组件
│   │   ├── photo-uploader.tsx
│   │   ├── camera-capture.tsx
│   │   └── image-preview.tsx
│   ├── persona/                  # 人设选择组件
│   │   ├── persona-selector.tsx
│   │   ├── persona-card.tsx
│   │   └── persona-grid.tsx
│   ├── result/                   # 结果展示组件
│   │   ├── monologue-card.tsx
│   │   ├── monologue-swiper.tsx
│   │   └── action-bar.tsx
│   ├── meme/                     # 梗图编辑组件
│   │   ├── meme-editor.tsx
│   │   ├── text-layer.tsx
│   │   ├── filter-selector.tsx
│   │   ├── font-selector.tsx
│   │   └── watermark.tsx
│   ├── share/                    # 分享组件
│   │   ├── share-sheet.tsx
│   │   └── qrcode-overlay.tsx
│   └── layout/                   # 布局组件
│       ├── header.tsx
│       ├── nav-bar.tsx
│       └── loading-screen.tsx
│
├── lib/                          # 工具库
│   ├── api/                      # API 客户端
│   │   ├── client.ts             # 基础请求封装
│   │   ├── generate.ts           # 生成相关 API
│   │   └── upload.ts             # 上传相关 API
│   ├── hooks/                    # 自定义 Hooks
│   │   ├── use-upload.ts
│   │   ├── use-generate.ts
│   │   ├── use-share.ts
│   │   ├── use-daily-limit.ts
│   │   └── use-media-query.ts
│   ├── stores/                   # Zustand stores
│   │   ├── app-store.ts
│   │   ├── upload-store.ts
│   │   └── meme-store.ts
│   ├── utils/                    # 工具函数
│   │   ├── cn.ts                 # className 合并
│   │   ├── image.ts              # 图片处理
│   │   ├── format.ts             # 格式化
│   │   └── storage.ts            # 本地存储
│   ├── constants/                # 常量定义
│   │   ├── personas.ts           # 人设配置
│   │   ├── fonts.ts              # 字体配置
│   │   └── filters.ts            # 滤镜配置
│   └── validations/              # Zod schemas
│       ├── upload.ts
│       ├── generate.ts
│       └── user.ts
│
├── types/                        # TypeScript 类型
│   ├── api.ts                    # API 响应类型
│   ├── persona.ts                # 人设类型
│   ├── meme.ts                   # 梗图类型
│   └── index.ts
│
├── public/                       # 静态资源
│   ├── fonts/                    # 网红字体文件
│   ├── icons/                    # PWA 图标
│   └── images/                   # 静态图片
│
├── styles/                       # 样式文件
│   └── fonts.css                 # 字体定义
│
└── config/                       # 配置文件
    ├── site.ts                   # 站点配置
    └── seo.ts                    # SEO 配置
```

---

## 3. 组件架构

### 3.1 组件层级图

```
App
├── RootLayout
│   ├── Providers (QueryClient, Zustand)
│   ├── Header
│   └── Main
│       ├── HomePage
│       │   ├── PhotoUploader
│       │   │   ├── DropZone
│       │   │   ├── CameraCapture
│       │   │   └── ImagePreview
│       │   └── QuickActions
│       │
│       ├── GeneratePage
│       │   ├── ImagePreview
│       │   ├── PersonaSelector
│       │   │   ├── PersonaGrid
│       │   │   └── PersonaCard[]
│       │   ├── GenerateButton
│       │   └── LoadingOverlay
│       │
│       ├── ResultPage
│       │   ├── ImageDisplay
│       │   ├── MonologueSwiper
│       │   │   └── MonologueCard[]
│       │   ├── ActionBar
│       │   │   ├── RegenerateButton
│       │   │   ├── MemeButton
│       │   │   └── ShareButton
│       │   └── ShareSheet
│       │
│       └── MemePage
│           ├── MemeEditor (Konva Stage)
│           │   ├── ImageLayer
│           │   ├── TextLayer
│           │   ├── FilterLayer
│           │   └── WatermarkLayer
│           ├── EditorToolbar
│           │   ├── FontSelector
│           │   ├── FilterSelector
│           │   └── TextStyler
│           └── ExportActions
```

### 3.2 核心组件设计

#### 3.2.1 PhotoUploader - 图片上传组件

```typescript
// components/upload/photo-uploader.tsx

interface PhotoUploaderProps {
  onUpload: (file: File, preview: string) => void;
  maxSize?: number; // 默认 10MB
  acceptedFormats?: string[]; // 默认 ['image/jpeg', 'image/png', 'image/heic']
}

/**
 * 功能需求映射：FR.1.1
 * - 支持从相册选择或实时拍摄
 * - 支持 JPG/PNG/HEIC 格式
 * - 单张最大 10MB
 * - 客户端压缩优化
 */
```

**实现要点：**
- 使用 `react-dropzone` 处理拖拽上传
- 使用 `<input type="file" capture="environment">` 调用相机
- HEIC 格式使用 `heic2any` 库转换
- 超过 2MB 的图片使用 `browser-image-compression` 压缩

#### 3.2.2 PersonaSelector - 人设选择器

```typescript
// components/persona/persona-selector.tsx

interface PersonaSelectorProps {
  selectedId: string;
  onSelect: (persona: Persona) => void;
  isPremiumUser?: boolean;
}

/**
 * 功能需求映射：FR.2.1, FR.2.2, FR.2.3
 * - 6 种基础人设 + 高级人设（付费）
 * - 默认选中"高冷主子"
 * - 付费人设显示锁定图标
 */
```

**人设配置数据：**

```typescript
// lib/constants/personas.ts

export const PERSONAS: Persona[] = [
  // 基础人设（免费）
  { id: 'cold-boss', name: '高冷总裁', icon: '👔', prompt: '...', isPremium: false },
  { id: 'chatty-auntie', name: '碎碎念大妈', icon: '👵', prompt: '...', isPremium: false },
  { id: 'artistic-youth', name: '文艺青年', icon: '🎨', prompt: '...', isPremium: false },
  { id: 'hot-blood', name: '热血少年', icon: '🔥', prompt: '...', isPremium: false },
  { id: 'sarcastic', name: '毒舌吐槽', icon: '😏', prompt: '...', isPremium: false },
  { id: 'humble-worker', name: '卑微打工人', icon: '💼', prompt: '...', isPremium: false },

  // 高级人设（付费）
  { id: 'zhenhuan', name: '甄嬛体', icon: '👑', prompt: '...', isPremium: true },
  { id: 'cyberpunk', name: '赛博朋克', icon: '🤖', prompt: '...', isPremium: true },
  { id: 'ceo-novel', name: '霸总文学', icon: '💎', prompt: '...', isPremium: true },
  { id: 'ancient-poem', name: '古风诗词', icon: '🏯', prompt: '...', isPremium: true },
];
```

#### 3.2.3 MonologueSwiper - 内心戏滑动组件

```typescript
// components/result/monologue-swiper.tsx

interface MonologueSwiperProps {
  monologues: Monologue[];
  onSelect: (index: number) => void;
  selectedIndex: number;
}

/**
 * 功能需求映射：FR.1.3, FR.1.4
 * - 展示 3 个不同版本的内心独白
 * - 支持左右滑动切换版本
 * - 指示器显示当前版本
 */
```

**实现要点：**
- 使用 Swiper 实现触摸滑动
- 配置 `pagination` 显示分页指示器
- 使用 Framer Motion 添加卡片切换动画

#### 3.2.4 MemeEditor - 梗图编辑器

```typescript
// components/meme/meme-editor.tsx

interface MemeEditorProps {
  imageUrl: string;
  text: string;
  onExport: (dataUrl: string) => void;
}

/**
 * 功能需求映射：FR.3.1, FR.3.2, FR.3.3, FR.3.4
 * - 将文案自动排版在图片上
 * - 提供 5 种网红字体样式
 * - 提供 3 种图片滤镜
 * - 添加产品水印
 */
```

**详见第 7 节：梗图编辑器详细设计**

#### 3.2.5 ShareSheet - 分享面板

```typescript
// components/share/share-sheet.tsx

interface ShareSheetProps {
  imageUrl: string;
  title: string;
  onShare: (platform: SharePlatform) => void;
  onSave: () => void;
}

type SharePlatform = 'wechat' | 'wechat-moments' | 'weibo' | 'xiaohongshu';

/**
 * 功能需求映射：FR.4.1, FR.4.2
 * - 支持分享到微信好友、朋友圈、小红书、微博
 * - 支持保存到本地相册
 */
```

---

## 4. 状态管理

### 4.1 状态分层策略

```
┌─────────────────────────────────────────────────────────┐
│                     Server State                        │
│  (TanStack Query - API 数据、缓存、同步)                  │
│  - 生成结果、用户信息、使用次数                            │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     Client State                        │
│  (Zustand - UI 状态、用户交互状态)                        │
│  - 上传图片、选中人设、编辑器状态                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     Local State                         │
│  (React useState - 组件内部状态)                         │
│  - 表单输入、动画状态、临时 UI 状态                        │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Zustand Store 设计

#### 4.2.1 AppStore - 全局应用状态

```typescript
// lib/stores/app-store.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // 用户状态
  dailyUsageCount: number;
  isPremiumUser: boolean;

  // Actions
  incrementUsage: () => void;
  resetDailyUsage: () => void;
  setPremiumStatus: (status: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      dailyUsageCount: 0,
      isPremiumUser: false,

      incrementUsage: () =>
        set((state) => ({ dailyUsageCount: state.dailyUsageCount + 1 })),

      resetDailyUsage: () =>
        set({ dailyUsageCount: 0 }),

      setPremiumStatus: (status) =>
        set({ isPremiumUser: status }),
    }),
    {
      name: 'pet-soul-app',
      partialize: (state) => ({
        dailyUsageCount: state.dailyUsageCount,
        isPremiumUser: state.isPremiumUser,
      }),
    }
  )
);
```

#### 4.2.2 UploadStore - 上传流程状态

```typescript
// lib/stores/upload-store.ts

import { create } from 'zustand';

interface UploadState {
  // 图片状态
  originalFile: File | null;
  previewUrl: string | null;
  compressedFile: File | null;

  // 选择状态
  selectedPersonaId: string;

  // 生成结果
  monologues: Monologue[];
  selectedMonologueIndex: number;

  // 流程状态
  step: 'upload' | 'persona' | 'generating' | 'result';
  isLoading: boolean;
  error: string | null;

  // Actions
  setImage: (file: File, previewUrl: string) => void;
  setCompressedImage: (file: File) => void;
  setPersona: (id: string) => void;
  setMonologues: (monologues: Monologue[]) => void;
  selectMonologue: (index: number) => void;
  setStep: (step: UploadState['step']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  originalFile: null,
  previewUrl: null,
  compressedFile: null,
  selectedPersonaId: 'cold-boss', // 默认高冷主子
  monologues: [],
  selectedMonologueIndex: 0,
  step: 'upload' as const,
  isLoading: false,
  error: null,
};

export const useUploadStore = create<UploadState>((set) => ({
  ...initialState,

  setImage: (file, previewUrl) =>
    set({ originalFile: file, previewUrl, step: 'persona' }),

  setCompressedImage: (file) =>
    set({ compressedFile: file }),

  setPersona: (id) =>
    set({ selectedPersonaId: id }),

  setMonologues: (monologues) =>
    set({ monologues, step: 'result', isLoading: false }),

  selectMonologue: (index) =>
    set({ selectedMonologueIndex: index }),

  setStep: (step) =>
    set({ step }),

  setLoading: (isLoading) =>
    set({ isLoading }),

  setError: (error) =>
    set({ error, isLoading: false }),

  reset: () =>
    set(initialState),
}));
```

#### 4.2.3 MemeStore - 梗图编辑器状态

```typescript
// lib/stores/meme-store.ts

import { create } from 'zustand';

interface TextStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  position: { x: number; y: number };
  rotation: number;
}

interface MemeState {
  // 图片
  imageUrl: string | null;

  // 文字
  text: string;
  textStyle: TextStyle;

  // 滤镜
  filter: 'none' | 'vintage' | 'blackwhite';

  // 水印
  showWatermark: boolean;

  // Actions
  setImage: (url: string) => void;
  setText: (text: string) => void;
  setTextStyle: (style: Partial<TextStyle>) => void;
  setFilter: (filter: MemeState['filter']) => void;
  setWatermark: (show: boolean) => void;
  reset: () => void;
}

const defaultTextStyle: TextStyle = {
  fontFamily: 'MaokenZhuyuanTi', // 猫啃珠圆体
  fontSize: 32,
  color: '#FFFFFF',
  strokeColor: '#000000',
  strokeWidth: 2,
  position: { x: 50, y: 80 }, // 百分比位置
  rotation: 0,
};

export const useMemeStore = create<MemeState>((set) => ({
  imageUrl: null,
  text: '',
  textStyle: defaultTextStyle,
  filter: 'none',
  showWatermark: true,

  setImage: (url) => set({ imageUrl: url }),
  setText: (text) => set({ text }),
  setTextStyle: (style) =>
    set((state) => ({
      textStyle: { ...state.textStyle, ...style }
    })),
  setFilter: (filter) => set({ filter }),
  setWatermark: (show) => set({ showWatermark: show }),
  reset: () => set({
    imageUrl: null,
    text: '',
    textStyle: defaultTextStyle,
    filter: 'none',
    showWatermark: true,
  }),
}));
```

### 4.3 TanStack Query 配置

```typescript
// lib/api/query-client.ts

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 分钟
      gcTime: 1000 * 60 * 30, // 30 分钟
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

```typescript
// lib/hooks/use-generate.ts

import { useMutation } from '@tanstack/react-query';
import { generateMonologues } from '@/lib/api/generate';

export function useGenerate() {
  return useMutation({
    mutationFn: generateMonologues,
    onSuccess: (data) => {
      // 埋点：content_generated
      trackEvent('content_generated', {
        generation_time_ms: data.generationTime,
        pet_type: data.petType,
        persona: data.persona,
      });
    },
    onError: (error) => {
      // 错误处理
      console.error('Generate failed:', error);
    },
  });
}
```

---

## 5. API 集成

### 5.1 API 客户端封装

```typescript
// lib/api/client.ts

import { z } from 'zod';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    const { params, ...init } = options;

    let url = `${BASE_URL}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const response = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(response.status, error.message || 'Request failed');
    }

    const data = await response.json();

    // Zod 验证响应数据
    if (schema) {
      return schema.parse(data);
    }

    return data as T;
  }

  get<T>(endpoint: string, options?: RequestOptions, schema?: z.ZodSchema<T>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' }, schema);
  }

  post<T>(endpoint: string, body: unknown, options?: RequestOptions, schema?: z.ZodSchema<T>) {
    return this.request<T>(
      endpoint,
      { ...options, method: 'POST', body: JSON.stringify(body) },
      schema
    );
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = new ApiClient();
```

### 5.2 生成 API

```typescript
// lib/api/generate.ts

import { z } from 'zod';
import { api } from './client';

// 请求 Schema
const GenerateRequestSchema = z.object({
  imageBase64: z.string(),
  personaId: z.string(),
  petProfileId: z.string().optional(),
});

// 响应 Schema
const MonologueSchema = z.object({
  id: z.string(),
  text: z.string(),
  tone: z.string(),
});

const GenerateResponseSchema = z.object({
  monologues: z.array(MonologueSchema),
  petType: z.string(),
  petBreed: z.string().optional(),
  emotion: z.string(),
  generationTime: z.number(),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
export type GenerateResponse = z.infer<typeof GenerateResponseSchema>;
export type Monologue = z.infer<typeof MonologueSchema>;

export async function generateMonologues(
  request: GenerateRequest
): Promise<GenerateResponse> {
  return api.post('/api/generate', request, {}, GenerateResponseSchema);
}
```

### 5.3 上传 API

```typescript
// lib/api/upload.ts

import { z } from 'zod';

const UploadResponseSchema = z.object({
  url: z.string().url(),
  key: z.string(),
  expiresAt: z.string().datetime(),
});

export type UploadResponse = z.infer<typeof UploadResponseSchema>;

export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return UploadResponseSchema.parse(data);
}
```

### 5.4 用户限额 API

```typescript
// lib/api/user.ts

import { z } from 'zod';
import { api } from './client';

const UsageLimitSchema = z.object({
  used: z.number(),
  limit: z.number(),
  resetAt: z.string().datetime(),
  isPremium: z.boolean(),
});

export type UsageLimit = z.infer<typeof UsageLimitSchema>;

export async function getUsageLimit(): Promise<UsageLimit> {
  return api.get('/api/user/limit', {}, UsageLimitSchema);
}

export async function checkAndIncrementUsage(): Promise<{
  allowed: boolean;
  remaining: number;
}> {
  return api.post('/api/user/use', {});
}
```

---

## 6. 图片处理系统

### 6.1 图片处理流程

```
用户选择图片
     │
     ▼
┌─────────────────┐
│  格式检测       │  检测 HEIC/JPEG/PNG
└─────────────────┘
     │
     ▼
┌─────────────────┐
│  HEIC 转换      │  heic2any → JPEG
└─────────────────┘
     │
     ▼
┌─────────────────┐
│  尺寸/大小检测   │  > 10MB 拒绝
└─────────────────┘
     │
     ▼
┌─────────────────┐
│  客户端压缩     │  > 2MB 压缩至 1MB
└─────────────────┘
     │
     ▼
┌─────────────────┐
│  生成预览       │  创建 Object URL
└─────────────────┘
     │
     ▼
┌─────────────────┐
│  转 Base64      │  用于 API 调用
└─────────────────┘
```

### 6.2 图片处理工具函数

```typescript
// lib/utils/image.ts

import imageCompression from 'browser-image-compression';

// 配置常量
export const IMAGE_CONFIG = {
  maxSizeMB: 10,
  compressTargetMB: 1,
  acceptedTypes: ['image/jpeg', 'image/png', 'image/heic', 'image/heif'],
  maxWidthOrHeight: 2048,
};

/**
 * 检测图片格式
 */
export function detectImageFormat(file: File): 'jpeg' | 'png' | 'heic' | 'unknown' {
  const type = file.type.toLowerCase();
  if (type === 'image/jpeg' || type === 'image/jpg') return 'jpeg';
  if (type === 'image/png') return 'png';
  if (type === 'image/heic' || type === 'image/heif') return 'heic';

  // 通过文件扩展名检测
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'heic' || ext === 'heif') return 'heic';

  return 'unknown';
}

/**
 * HEIC 转 JPEG
 */
export async function convertHeicToJpeg(file: File): Promise<File> {
  const heic2any = (await import('heic2any')).default;

  const blob = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.9,
  });

  const convertedBlob = Array.isArray(blob) ? blob[0] : blob;

  return new File(
    [convertedBlob],
    file.name.replace(/\.heic$/i, '.jpg'),
    { type: 'image/jpeg' }
  );
}

/**
 * 压缩图片
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: IMAGE_CONFIG.compressTargetMB,
    maxWidthOrHeight: IMAGE_CONFIG.maxWidthOrHeight,
    useWebWorker: true,
    fileType: 'image/jpeg',
  };

  return imageCompression(file, options);
}

/**
 * 处理上传的图片（完整流程）
 */
export async function processUploadedImage(file: File): Promise<{
  processedFile: File;
  previewUrl: string;
  base64: string;
}> {
  // 1. 格式检测
  const format = detectImageFormat(file);
  if (format === 'unknown') {
    throw new Error('不支持的图片格式，请上传 JPG、PNG 或 HEIC 格式的图片');
  }

  // 2. 大小检测
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > IMAGE_CONFIG.maxSizeMB) {
    throw new Error(`图片过大，请上传小于 ${IMAGE_CONFIG.maxSizeMB}MB 的图片`);
  }

  // 3. HEIC 转换
  let processedFile = file;
  if (format === 'heic') {
    processedFile = await convertHeicToJpeg(file);
  }

  // 4. 压缩
  if (processedFile.size > IMAGE_CONFIG.compressTargetMB * 1024 * 1024) {
    processedFile = await compressImage(processedFile);
  }

  // 5. 生成预览
  const previewUrl = URL.createObjectURL(processedFile);

  // 6. 转 Base64
  const base64 = await fileToBase64(processedFile);

  return { processedFile, previewUrl, base64 };
}

/**
 * File 转 Base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // 移除 data:image/xxx;base64, 前缀
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 清理预览 URL
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
```

### 6.3 上传 Hook

```typescript
// lib/hooks/use-upload.ts

import { useState, useCallback } from 'react';
import { processUploadedImage, revokePreviewUrl } from '@/lib/utils/image';
import { useUploadStore } from '@/lib/stores/upload-store';
import { trackEvent } from '@/lib/analytics';

interface UseUploadOptions {
  onSuccess?: (result: { file: File; previewUrl: string; base64: string }) => void;
  onError?: (error: Error) => void;
}

export function useUpload(options: UseUploadOptions = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setImage, setCompressedImage } = useUploadStore();

  const handleUpload = useCallback(async (file: File, source: 'camera' | 'album') => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await processUploadedImage(file);

      // 更新 store
      setImage(file, result.previewUrl);
      setCompressedImage(result.processedFile);

      // 埋点
      trackEvent('photo_uploaded', {
        source,
        file_size: file.size,
        original_format: file.type,
        compressed_size: result.processedFile.size,
      });

      options.onSuccess?.(result);

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '图片处理失败';
      setError(errorMessage);
      options.onError?.(err as Error);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, [setImage, setCompressedImage, options]);

  const reset = useCallback(() => {
    setError(null);
  }, []);

  return {
    handleUpload,
    isProcessing,
    error,
    reset,
  };
}
```

---

## 7. 梗图编辑器

### 7.1 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                    MemeEditor                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │                 Konva Stage                       │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │              Layer: Image                   │  │  │
│  │  │  ┌───────────────────────────────────────┐  │  │  │
│  │  │  │         Image (with filter)           │  │  │  │
│  │  │  └───────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │              Layer: Text                    │  │  │
│  │  │  ┌───────────────────────────────────────┐  │  │  │
│  │  │  │    Text (draggable, editable)         │  │  │  │
│  │  │  └───────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │             Layer: Watermark                │  │  │
│  │  │  ┌───────────────────────────────────────┐  │  │  │
│  │  │  │    Watermark Image/Text               │  │  │  │
│  │  │  └───────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 7.2 MemeEditor 组件实现

```typescript
// components/meme/meme-editor.tsx

'use client';

import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text, Group } from 'react-konva';
import Konva from 'konva';
import { useMemeStore } from '@/lib/stores/meme-store';
import { FILTERS, FONTS } from '@/lib/constants';

interface MemeEditorProps {
  width?: number;
  height?: number;
}

export function MemeEditor({ width = 375, height = 500 }: MemeEditorProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [dimensions, setDimensions] = useState({ width, height });

  const {
    imageUrl,
    text,
    textStyle,
    filter,
    showWatermark,
    setTextStyle,
  } = useMemeStore();

  // 加载图片
  useEffect(() => {
    if (!imageUrl) return;

    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);

      // 计算适配尺寸
      const aspectRatio = img.width / img.height;
      if (aspectRatio > 1) {
        setDimensions({
          width,
          height: width / aspectRatio,
        });
      } else {
        setDimensions({
          width: height * aspectRatio,
          height,
        });
      }
    };
  }, [imageUrl, width, height]);

  // 获取滤镜函数
  const getFilterFunction = () => {
    switch (filter) {
      case 'vintage':
        return [Konva.Filters.Sepia, Konva.Filters.Contrast];
      case 'blackwhite':
        return [Konva.Filters.Grayscale];
      default:
        return [];
    }
  };

  // 导出图片
  const exportImage = (): string | null => {
    if (!stageRef.current) return null;

    return stageRef.current.toDataURL({
      pixelRatio: 2, // 高清导出
      mimeType: 'image/jpeg',
      quality: 0.9,
    });
  };

  // 处理文字拖拽
  const handleTextDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target;
    setTextStyle({
      position: {
        x: (node.x() / dimensions.width) * 100,
        y: (node.y() / dimensions.height) * 100,
      },
    });
  };

  return (
    <div className="relative">
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        className="bg-gray-100 rounded-lg overflow-hidden"
      >
        {/* 图片层 */}
        <Layer>
          {image && (
            <KonvaImage
              image={image}
              width={dimensions.width}
              height={dimensions.height}
              filters={getFilterFunction()}
            />
          )}
        </Layer>

        {/* 文字层 */}
        <Layer>
          <Text
            text={text}
            x={(textStyle.position.x / 100) * dimensions.width}
            y={(textStyle.position.y / 100) * dimensions.height}
            fontSize={textStyle.fontSize}
            fontFamily={textStyle.fontFamily}
            fill={textStyle.color}
            stroke={textStyle.strokeColor}
            strokeWidth={textStyle.strokeWidth}
            rotation={textStyle.rotation}
            draggable
            onDragEnd={handleTextDragEnd}
            // 文字换行
            width={dimensions.width * 0.9}
            align="center"
            wrap="word"
          />
        </Layer>

        {/* 水印层 */}
        {showWatermark && (
          <Layer>
            <Group
              x={dimensions.width - 100}
              y={dimensions.height - 30}
            >
              <Text
                text="宠灵感 PetSoul"
                fontSize={12}
                fontFamily="sans-serif"
                fill="rgba(255, 255, 255, 0.6)"
                shadowColor="black"
                shadowBlur={2}
              />
            </Group>
          </Layer>
        )}
      </Stage>
    </div>
  );
}
```

### 7.3 字体配置

```typescript
// lib/constants/fonts.ts

export interface FontConfig {
  id: string;
  name: string;
  family: string;
  preview: string;
  weight?: number;
}

export const FONTS: FontConfig[] = [
  {
    id: 'maoken',
    name: '猫啃珠圆体',
    family: 'MaokenZhuyuanTi',
    preview: '萌萌哒',
  },
  {
    id: 'zcool-kuaile',
    name: '站酷快乐体',
    family: 'ZCOOLKuaiLe',
    preview: '超开心',
  },
  {
    id: 'zcool-xiaowei',
    name: '站酷小薇体',
    family: 'ZCOOLXiaoWei',
    preview: '很可爱',
  },
  {
    id: 'smiley',
    name: '思源黑体',
    family: 'Noto Sans SC',
    preview: '标准体',
    weight: 700,
  },
  {
    id: 'pixel',
    name: '像素体',
    family: 'Zpix',
    preview: '复古风',
  },
];
```

### 7.4 滤镜配置

```typescript
// lib/constants/filters.ts

export interface FilterConfig {
  id: 'none' | 'vintage' | 'blackwhite';
  name: string;
  preview: string;
}

export const FILTERS: FilterConfig[] = [
  {
    id: 'none',
    name: '原图',
    preview: '/images/filter-none.jpg',
  },
  {
    id: 'vintage',
    name: '复古',
    preview: '/images/filter-vintage.jpg',
  },
  {
    id: 'blackwhite',
    name: '黑白',
    preview: '/images/filter-bw.jpg',
  },
];
```

### 7.5 导出功能

```typescript
// lib/hooks/use-meme-export.ts

import { useCallback } from 'react';
import { useMemeStore } from '@/lib/stores/meme-store';
import { trackEvent } from '@/lib/analytics';

export function useMemeExport(stageRef: React.RefObject<Konva.Stage>) {
  const { showWatermark } = useMemeStore();

  const exportToDataUrl = useCallback((): string | null => {
    if (!stageRef.current) return null;

    return stageRef.current.toDataURL({
      pixelRatio: 2,
      mimeType: 'image/jpeg',
      quality: 0.9,
    });
  }, [stageRef]);

  const exportToBlob = useCallback(async (): Promise<Blob | null> => {
    if (!stageRef.current) return null;

    return new Promise((resolve) => {
      stageRef.current!.toBlob({
        pixelRatio: 2,
        mimeType: 'image/jpeg',
        quality: 0.9,
        callback: resolve,
      });
    });
  }, [stageRef]);

  const saveToDevice = useCallback(async () => {
    const dataUrl = exportToDataUrl();
    if (!dataUrl) return;

    // 使用 download 属性下载
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `petsoul-${Date.now()}.jpg`;
    link.click();

    // 埋点
    trackEvent('meme_created', {
      has_watermark: showWatermark,
    });
  }, [exportToDataUrl, showWatermark]);

  const shareImage = useCallback(async () => {
    const blob = await exportToBlob();
    if (!blob) return;

    // 使用 Web Share API
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], 'petsoul.jpg', { type: 'image/jpeg' });

      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: '宠灵感 - 我的宠物内心戏',
        });
        return;
      }
    }

    // 降级：复制到剪贴板
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/jpeg': blob }),
      ]);
    } catch {
      // 再次降级：下载
      await saveToDevice();
    }
  }, [exportToBlob, saveToDevice]);

  return {
    exportToDataUrl,
    exportToBlob,
    saveToDevice,
    shareImage,
  };
}
```

---

## 8. PWA 配置

### 8.1 Manifest 配置

```typescript
// app/manifest.ts

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '宠灵感 PetSoul',
    short_name: '宠灵感',
    description: '让每张宠物照片都有内心戏',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#6366f1',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/home.png',
        sizes: '1080x1920',
        type: 'image/png',
        form_factor: 'narrow',
      },
    ],
    categories: ['entertainment', 'lifestyle', 'social'],
    lang: 'zh-CN',
  };
}
```

### 8.2 next-pwa 配置

```javascript
// next.config.js

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 年
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-static',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 天
        },
      },
    },
    {
      urlPattern: /^\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 5, // 5 分钟
        },
      },
    },
  ],
});

module.exports = withPWA({
  // Next.js 配置
});
```

### 8.3 安装提示组件

```typescript
// components/pwa/install-prompt.tsx

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4 z-50 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
      >
        <X size={20} />
      </button>

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Download className="text-indigo-600" size={24} />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">添加到主屏幕</h3>
          <p className="text-sm text-gray-500">安装应用，获得更好体验</p>
        </div>

        <Button onClick={handleInstall} size="sm">
          安装
        </Button>
      </div>
    </div>
  );
}
```

---

## 9. 事件埋点系统

### 9.1 埋点事件定义

基于 PRD 1.4 节的埋点需求：

```typescript
// lib/analytics/events.ts

export const ANALYTICS_EVENTS = {
  // P0 事件
  PHOTO_UPLOADED: 'photo_uploaded',
  PERSONA_SELECTED: 'persona_selected',
  CONTENT_GENERATED: 'content_generated',
  CONTENT_SHARED: 'content_shared',
  SUBSCRIPTION_STARTED: 'subscription_started',

  // P1 事件
  MEME_CREATED: 'meme_created',
  PROFILE_CREATED: 'profile_created',
} as const;

// 事件属性类型
export interface EventProperties {
  photo_uploaded: {
    source: 'camera' | 'album';
    file_size: number;
  };
  persona_selected: {
    persona_type: string;
    is_custom: boolean;
  };
  content_generated: {
    generation_time_ms: number;
    pet_type: string;
    persona: string;
  };
  content_shared: {
    platform: 'wechat' | 'wechat-moments' | 'weibo' | 'xiaohongshu' | 'save';
    content_type: 'monologue' | 'meme';
  };
  meme_created: {
    template_id?: string;
    has_watermark: boolean;
  };
  profile_created: {
    pet_type: string;
    personality_tags: string[];
  };
  subscription_started: {
    plan_type: 'monthly' | 'yearly';
    price: number;
  };
}
```

### 9.2 埋点工具封装

```typescript
// lib/analytics/index.ts

import { ANALYTICS_EVENTS, EventProperties } from './events';

type EventName = keyof typeof ANALYTICS_EVENTS;
type EventValue = (typeof ANALYTICS_EVENTS)[EventName];

// 埋点服务接口
interface AnalyticsProvider {
  track: (event: string, properties?: Record<string, unknown>) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
  page: (name?: string, properties?: Record<string, unknown>) => void;
}

// 默认实现（开发环境）
const devProvider: AnalyticsProvider = {
  track: (event, properties) => {
    console.log('[Analytics] Track:', event, properties);
  },
  identify: (userId, traits) => {
    console.log('[Analytics] Identify:', userId, traits);
  },
  page: (name, properties) => {
    console.log('[Analytics] Page:', name, properties);
  },
};

// Mixpanel 实现（生产环境）
const createMixpanelProvider = (): AnalyticsProvider => {
  // 延迟加载 Mixpanel
  let mixpanel: typeof import('mixpanel-browser') | null = null;

  const getMixpanel = async () => {
    if (!mixpanel) {
      mixpanel = await import('mixpanel-browser');
      mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!);
    }
    return mixpanel;
  };

  return {
    track: async (event, properties) => {
      const mp = await getMixpanel();
      mp.track(event, properties);
    },
    identify: async (userId, traits) => {
      const mp = await getMixpanel();
      mp.identify(userId);
      if (traits) {
        mp.people.set(traits);
      }
    },
    page: async (name, properties) => {
      const mp = await getMixpanel();
      mp.track('Page View', { page: name, ...properties });
    },
  };
};

// 根据环境选择 provider
const provider: AnalyticsProvider =
  process.env.NODE_ENV === 'production'
    ? createMixpanelProvider()
    : devProvider;

// 类型安全的埋点函数
export function trackEvent<T extends EventName>(
  event: T,
  properties: EventProperties[T]
): void {
  provider.track(ANALYTICS_EVENTS[event], {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}

export function identifyUser(userId: string, traits?: Record<string, unknown>): void {
  provider.identify(userId, traits);
}

export function trackPageView(pageName: string): void {
  provider.page(pageName);
}
```

### 9.3 埋点 Hook

```typescript
// lib/hooks/use-analytics.ts

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';

export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
}
```

### 9.4 在组件中使用

```typescript
// 示例：上传组件中的埋点

import { trackEvent } from '@/lib/analytics';

function handleUpload(file: File, source: 'camera' | 'album') {
  // ... 上传逻辑

  trackEvent('photo_uploaded', {
    source,
    file_size: file.size,
  });
}

// 示例：分享组件中的埋点

function handleShare(platform: SharePlatform) {
  // ... 分享逻辑

  trackEvent('content_shared', {
    platform,
    content_type: 'meme',
  });
}
```

---

## 10. 错误处理

### 10.1 错误边界组件

```typescript
// components/error-boundary.tsx

'use client';

import { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            出错了
          </h2>
          <p className="text-gray-500 mb-4">
            页面加载出现问题，请重试
          </p>
          <Button onClick={this.handleRetry}>
            重试
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 10.2 错误提示映射

```typescript
// lib/utils/error-messages.ts

export const ERROR_MESSAGES: Record<string, string> = {
  // 上传错误
  'UPLOAD_TOO_LARGE': '图片过大，请上传小于 10MB 的图片',
  'UPLOAD_INVALID_FORMAT': '不支持的图片格式，请上传 JPG、PNG 或 HEIC 格式',
  'UPLOAD_FAILED': '图片上传失败，请检查网络后重试',

  // 生成错误
  'GENERATE_NO_PET': '未检测到宠物，请上传包含宠物的照片',
  'GENERATE_TIMEOUT': '生成超时，请重试',
  'GENERATE_FAILED': 'AI 生成失败，请重试',
  'GENERATE_CONTENT_BLOCKED': '生成内容不符合规范，已自动重新生成',

  // 限额错误
  'LIMIT_EXCEEDED': '今日免费次数已用完，开通会员享无限次数',

  // 网络错误
  'NETWORK_ERROR': '网络连接失败，请检查网络设置',
  'SERVER_ERROR': '服务器繁忙，请稍后重试',

  // 默认错误
  'UNKNOWN': '发生未知错误，请重试',
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES['UNKNOWN'];
}
```

### 10.3 Toast 通知

```typescript
// lib/hooks/use-toast.ts

import { create } from 'zustand';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Math.random().toString(36).slice(2);
    const newToast = { ...toast, id };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // 自动移除
    const duration = toast.duration ?? 3000;
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));

// 便捷方法
export function toast(message: string, type: Toast['type'] = 'info') {
  useToastStore.getState().addToast({ message, type });
}

export function toastError(message: string) {
  toast(message, 'error');
}

export function toastSuccess(message: string) {
  toast(message, 'success');
}
```

---

## 11. 性能优化

### 11.1 图片优化

```typescript
// next.config.js

module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [375, 640, 750, 828, 1080],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
    ],
  },
};
```

### 11.2 代码分割

```typescript
// 动态导入重量级组件

import dynamic from 'next/dynamic';

// 梗图编辑器（包含 Konva）
const MemeEditor = dynamic(
  () => import('@/components/meme/meme-editor').then((mod) => mod.MemeEditor),
  {
    loading: () => <MemeEditorSkeleton />,
    ssr: false, // Konva 不支持 SSR
  }
);

// 分享面板
const ShareSheet = dynamic(
  () => import('@/components/share/share-sheet').then((mod) => mod.ShareSheet),
  { ssr: false }
);
```

### 11.3 字体优化

```typescript
// app/layout.tsx

import { Noto_Sans_SC } from 'next/font/google';
import localFont from 'next/font/local';

// Google 字体（自动优化）
const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: true,
});

// 本地字体（网红字体）
const maokenFont = localFont({
  src: '../public/fonts/MaokenZhuyuanTi.woff2',
  display: 'swap',
  variable: '--font-maoken',
});

export default function RootLayout({ children }) {
  return (
    <html className={`${notoSansSC.className} ${maokenFont.variable}`}>
      {children}
    </html>
  );
}
```

### 11.4 缓存策略

```typescript
// lib/api/client.ts

// 请求去重
const pendingRequests = new Map<string, Promise<unknown>>();

async function deduplicatedFetch<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key) as Promise<T>;
  }

  const promise = fetcher().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}
```

### 11.5 性能指标监控

```typescript
// app/layout.tsx

import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 12. 测试策略

### 12.1 单元测试

```typescript
// __tests__/utils/image.test.ts

import { describe, it, expect } from 'vitest';
import { detectImageFormat, IMAGE_CONFIG } from '@/lib/utils/image';

describe('Image Utils', () => {
  describe('detectImageFormat', () => {
    it('should detect JPEG format', () => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
      expect(detectImageFormat(file)).toBe('jpeg');
    });

    it('should detect HEIC format by extension', () => {
      const file = new File([''], 'test.heic', { type: '' });
      expect(detectImageFormat(file)).toBe('heic');
    });

    it('should return unknown for unsupported formats', () => {
      const file = new File([''], 'test.gif', { type: 'image/gif' });
      expect(detectImageFormat(file)).toBe('unknown');
    });
  });
});
```

### 12.2 组件测试

```typescript
// __tests__/components/persona-selector.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { PersonaSelector } from '@/components/persona/persona-selector';
import { PERSONAS } from '@/lib/constants/personas';

describe('PersonaSelector', () => {
  it('should render all personas', () => {
    render(
      <PersonaSelector
        selectedId="cold-boss"
        onSelect={() => {}}
      />
    );

    PERSONAS.forEach((persona) => {
      expect(screen.getByText(persona.name)).toBeInTheDocument();
    });
  });

  it('should call onSelect when persona is clicked', () => {
    const onSelect = vi.fn();
    render(
      <PersonaSelector
        selectedId="cold-boss"
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText('碎碎念大妈'));

    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'chatty-auntie' })
    );
  });

  it('should show lock icon for premium personas when not premium user', () => {
    render(
      <PersonaSelector
        selectedId="cold-boss"
        onSelect={() => {}}
        isPremiumUser={false}
      />
    );

    const premiumPersona = screen.getByText('甄嬛体').closest('button');
    expect(premiumPersona).toHaveAttribute('data-locked', 'true');
  });
});
```

### 12.3 E2E 测试

```typescript
// e2e/generate-flow.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Generate Flow', () => {
  test('should complete full generation flow', async ({ page }) => {
    await page.goto('/');

    // 上传图片
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('fixtures/cat.jpg');

    // 等待预览
    await expect(page.locator('[data-testid="image-preview"]')).toBeVisible();

    // 选择人设
    await page.click('text=毒舌吐槽');

    // 点击生成
    await page.click('text=生成内心戏');

    // 等待结果
    await expect(page.locator('[data-testid="monologue-card"]')).toBeVisible({
      timeout: 10000,
    });

    // 验证有 3 个版本
    const cards = await page.locator('[data-testid="monologue-card"]').count();
    expect(cards).toBe(3);
  });

  test('should show error for non-pet image', async ({ page }) => {
    await page.goto('/');

    // 上传非宠物图片
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('fixtures/landscape.jpg');

    await page.click('text=生成内心戏');

    // 验证错误提示
    await expect(page.locator('text=未检测到宠物')).toBeVisible();
  });
});
```

---

## 附录 A：依赖版本清单

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
    "heic2any": "^0.0.4",
    "konva": "^9.0.0",
    "react-konva": "^18.0.0",

    "zustand": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.50.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.3.0",

    "next-pwa": "^5.6.0",

    "@vercel/analytics": "^1.2.0",
    "@vercel/speed-insights": "^1.0.0",
    "@sentry/nextjs": "^8.0.0",
    "mixpanel-browser": "^2.50.0",

    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "typescript": "^5.9.0",
    "@types/react": "^19.0.0",
    "@types/node": "^22.0.0",

    "vitest": "^2.0.0",
    "@testing-library/react": "^16.0.0",
    "playwright": "^1.45.0"
  }
}
```

---

## 附录 B：功能需求与组件映射

| 功能 ID | 需求描述 | 对应组件 | 优先级 |
| --- | --- | --- | --- |
| FR.1.1 | 照片上传 | `PhotoUploader` | P0 |
| FR.1.2 | AI 图像识别 | API: `/api/generate` | P0 |
| FR.1.3 | 内心戏生成 | `MonologueSwiper` | P0 |
| FR.1.4 | 生成结果展示 | `MonologueCard` | P0 |
| FR.1.5 | 重新生成 | `ActionBar` | P1 |
| FR.2.1 | 预设人设模板 | `PERSONAS` 配置 | P0 |
| FR.2.2 | 人设选择器 | `PersonaSelector` | P0 |
| FR.2.3 | 高级人设 | `PersonaCard` (locked) | P1 |
| FR.3.1 | 梗图生成 | `MemeEditor` | P0 |
| FR.3.2 | 字体选择 | `FontSelector` | P1 |
| FR.3.3 | 滤镜效果 | `FilterSelector` | P1 |
| FR.3.4 | 水印/Logo | `WatermarkLayer` | P0 |
| FR.4.1 | 一键分享 | `ShareSheet` | P0 |
| FR.4.2 | 图片保存 | `useMemeExport` | P0 |
| FR.4.3 | 裂变二维码 | `QRCodeOverlay` | P1 |
| FR.5.1 | 创建档案 | `ProfileForm` | P1 |
| FR.5.2 | 性格标签 | `TagSelector` | P1 |
| FR.5.3 | 档案关联 | `PetSelector` | P1 |
