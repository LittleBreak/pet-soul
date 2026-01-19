# 第二阶段：全局数据模型定义（Types）

| **属性** | **详情** |
| --- | --- |
| **状态** | `待开发` |
| **最后更新** | 2026-01-19 |
| **前置阶段** | [phase-1-blueprint.md](./phase-1-blueprint.md) |
| **关联文档** | [PRD](../prd-zh.md) · [前端架构](../frontend-architecture-zh.md) |

---

## 目录

1. [阶段目标](#1-阶段目标)
2. [任务清单](#2-任务清单)
3. [核心业务类型](#3-核心业务类型)
4. [API 类型定义](#4-api-类型定义)
5. [常量配置](#5-常量配置)
6. [Zod Schema](#6-zod-schema)
7. [验收标准](#7-验收标准)

---

## 1. 阶段目标

定义项目的类型系统，这是后续开发一致性的基础：

- [ ] 定义核心业务实体类型
- [ ] 定义 API 请求/响应类型
- [ ] 创建常量配置
- [ ] 创建 Zod Schema 用于运行时校验

**产出物：**
- `types/index.ts` - 核心业务类型
- `types/api.ts` - API 相关类型
- `lib/constants/*.ts` - 常量配置
- `lib/validations/*.ts` - Zod Schema

---

## 2. 任务清单

### 2.1 类型定义任务

| 序号 | 任务 | 描述 | 优先级 | 状态 |
| --- | --- | --- | --- | --- |
| 2.1 | 宠物相关类型 | PetType、PetEmotion、PetProfile | P0 | ⬜ |
| 2.2 | 人设相关类型 | Persona、PersonaCategory | P0 | ⬜ |
| 2.3 | 内心戏相关类型 | Monologue、GenerationResult | P0 | ⬜ |
| 2.4 | 梗图相关类型 | TextStyle、FilterType、MemeConfig | P0 | ⬜ |
| 2.5 | 用户相关类型 | User、UsageLimit | P0 | ⬜ |
| 2.6 | 分享相关类型 | SharePlatform、ShareContentType | P1 | ⬜ |
| 2.7 | 图片处理类型 | ProcessedImage、ImageConfig | P0 | ⬜ |
| 2.8 | UI 状态类型 | GenerationStep、LoadingState、ErrorState | P0 | ⬜ |

### 2.2 API 类型任务

| 序号 | 任务 | 描述 | 优先级 | 状态 |
| --- | --- | --- | --- | --- |
| 2.9 | 通用响应类型 | ApiResponse、ApiError | P0 | ⬜ |
| 2.10 | 生成接口类型 | GenerateRequest、GenerateResponse | P0 | ⬜ |
| 2.11 | 上传接口类型 | UploadResponse | P0 | ⬜ |
| 2.12 | 用户接口类型 | UsageLimitResponse、UseOnceResponse | P0 | ⬜ |
| 2.13 | 埋点事件类型 | AnalyticsEvent、EventProperties | P1 | ⬜ |

### 2.3 常量配置任务

| 序号 | 任务 | 描述 | 优先级 | 状态 |
| --- | --- | --- | --- | --- |
| 2.14 | 人设配置 | 6 种基础 + 4 种付费人设 | P0 | ⬜ |
| 2.15 | 字体配置 | 5 种网红字体 | P1 | ⬜ |
| 2.16 | 滤镜配置 | 3 种滤镜 | P1 | ⬜ |
| 2.17 | 图片配置 | 大小限制、格式限制 | P0 | ⬜ |
| 2.18 | 错误码配置 | 错误码和消息映射 | P0 | ⬜ |

### 2.4 Schema 任务

| 序号 | 任务 | 描述 | 优先级 | 状态 |
| --- | --- | --- | --- | --- |
| 2.19 | 生成 Schema | generateRequestSchema、generateResponseSchema | P0 | ⬜ |
| 2.20 | 上传 Schema | fileSchema、uploadResponseSchema | P0 | ⬜ |
| 2.21 | 用户 Schema | usageLimitSchema、useOnceResponseSchema | P0 | ⬜ |

---

## 3. 核心业务类型

### 3.1 文件：`types/index.ts`

```typescript
// types/index.ts

// ==================== 宠物相关 ====================

/**
 * 宠物类型枚举
 */
export type PetType = 'cat' | 'dog' | 'other';

/**
 * 宠物情绪枚举
 */
export type PetEmotion =
  | 'happy'      // 开心
  | 'angry'      // 生气
  | 'sad'        // 悲伤
  | 'surprised'  // 惊讶
  | 'sleepy'     // 困倦
  | 'curious'    // 好奇
  | 'bored'      // 无聊
  | 'scared'     // 害怕
  | 'neutral';   // 平静

/**
 * 宠物档案（P1 功能）
 */
export interface PetProfile {
  id: string;
  name: string;
  type: PetType;
  breed?: string;
  gender?: 'male' | 'female' | 'unknown';
  age?: number;
  personalityTags: string[];
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== 人设相关 ====================

/**
 * 人设配置
 */
export interface Persona {
  id: string;
  name: string;
  icon: string;
  description: string;
  prompt: string;
  isPremium: boolean;
  category: PersonaCategory;
}

/**
 * 人设分类
 */
export type PersonaCategory = 'basic' | 'premium' | 'seasonal';

/**
 * 预设人设 ID
 */
export type PresetPersonaId =
  | 'cold-boss'       // 高冷总裁
  | 'chatty-auntie'   // 碎碎念大妈
  | 'artistic-youth'  // 文艺青年
  | 'hot-blood'       // 热血少年
  | 'sarcastic'       // 毒舌吐槽
  | 'humble-worker'   // 卑微打工人
  | 'zhenhuan'        // 甄嬛体（付费）
  | 'cyberpunk'       // 赛博朋克（付费）
  | 'ceo-novel'       // 霸总文学（付费）
  | 'ancient-poem';   // 古风诗词（付费）

// ==================== 内心戏相关 ====================

/**
 * 内心戏文案
 */
export interface Monologue {
  id: string;
  text: string;
  tone: MonologueTone;
  length: 'short' | 'medium' | 'long';
}

/**
 * 内心戏语气
 */
export type MonologueTone =
  | 'humorous'   // 幽默
  | 'sarcastic'  // 吐槽
  | 'cute'       // 卖萌
  | 'dramatic'   // 戏剧化
  | 'poetic';    // 文艺

/**
 * 生成结果
 */
export interface GenerationResult {
  id: string;
  imageUrl: string;
  monologues: Monologue[];
  petType: PetType;
  petBreed?: string;
  emotion: PetEmotion;
  persona: Persona;
  generationTime: number;
  createdAt: string;
}

// ==================== 梗图相关 ====================

/**
 * 文字样式
 */
export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  position: Position;
  rotation: number;
}

/**
 * 位置（百分比）
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * 滤镜类型
 */
export type FilterType = 'none' | 'vintage' | 'blackwhite';

/**
 * 字体配置
 */
export interface FontConfig {
  id: string;
  name: string;
  family: string;
  preview: string;
  weight?: number;
}

/**
 * 滤镜配置
 */
export interface FilterConfig {
  id: FilterType;
  name: string;
  preview: string;
}

/**
 * 梗图配置
 */
export interface MemeConfig {
  imageUrl: string;
  text: string;
  textStyle: TextStyle;
  filter: FilterType;
  showWatermark: boolean;
}

// ==================== 用户相关 ====================

/**
 * 用户信息
 */
export interface User {
  id: string;
  nickname?: string;
  avatarUrl?: string;
  isPremium: boolean;
  premiumExpireAt?: string;
  createdAt: string;
}

/**
 * 使用限额
 */
export interface UsageLimit {
  used: number;
  limit: number;
  resetAt: string;
  isPremium: boolean;
}

// ==================== 分享相关 ====================

/**
 * 分享平台
 */
export type SharePlatform =
  | 'wechat'          // 微信好友
  | 'wechat-moments'  // 朋友圈
  | 'weibo'           // 微博
  | 'xiaohongshu'     // 小红书
  | 'save';           // 保存到相册

/**
 * 分享内容类型
 */
export type ShareContentType = 'monologue' | 'meme';

// ==================== 图片处理相关 ====================

/**
 * 图片格式
 */
export type ImageFormat = 'jpeg' | 'png' | 'heic' | 'unknown';

/**
 * 图片处理结果
 */
export interface ProcessedImage {
  file: File;
  previewUrl: string;
  base64: string;
  originalSize: number;
  compressedSize: number;
  format: ImageFormat;
}

/**
 * 图片配置常量
 */
export interface ImageConfig {
  maxSizeMB: number;
  compressTargetMB: number;
  acceptedTypes: string[];
  maxWidthOrHeight: number;
}

// ==================== UI 状态相关 ====================

/**
 * 生成流程步骤
 */
export type GenerationStep = 'upload' | 'persona' | 'generating' | 'result';

/**
 * 加载状态
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
}

/**
 * 错误状态
 */
export interface ErrorState {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

---

## 4. API 类型定义

### 4.1 文件：`types/api.ts`

```typescript
// types/api.ts

import type {
  Monologue,
  PetType,
  PetEmotion,
  UsageLimit,
} from './index';

// ==================== 错误码 ====================

export type ErrorCode =
  | 'UPLOAD_TOO_LARGE'
  | 'UPLOAD_INVALID_FORMAT'
  | 'UPLOAD_FAILED'
  | 'GENERATE_NO_PET'
  | 'GENERATE_TIMEOUT'
  | 'GENERATE_FAILED'
  | 'GENERATE_CONTENT_BLOCKED'
  | 'LIMIT_EXCEEDED'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN';

// ==================== 通用响应 ====================

/**
 * API 基础响应
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * API 错误
 */
export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

// ==================== 生成接口 ====================

/**
 * 生成请求
 */
export interface GenerateRequest {
  /** Base64 编码的图片数据 */
  imageBase64: string;
  /** 人设 ID */
  personaId: string;
  /** 宠物档案 ID（可选） */
  petProfileId?: string;
}

/**
 * 生成响应
 */
export interface GenerateResponse {
  /** 生成的内心戏列表（3个版本） */
  monologues: Monologue[];
  /** 识别到的宠物类型 */
  petType: PetType;
  /** 识别到的宠物品种 */
  petBreed?: string;
  /** 识别到的宠物情绪 */
  emotion: PetEmotion;
  /** 生成耗时（毫秒） */
  generationTime: number;
}

// ==================== 上传接口 ====================

/**
 * 上传响应
 */
export interface UploadResponse {
  /** 图片访问 URL */
  url: string;
  /** 图片存储 Key */
  key: string;
  /** 过期时间 */
  expiresAt: string;
}

// ==================== 用户接口 ====================

/**
 * 获取使用限额响应
 */
export interface GetUsageLimitResponse extends UsageLimit {}

/**
 * 使用一次响应
 */
export interface UseOnceResponse {
  /** 是否允许使用 */
  allowed: boolean;
  /** 剩余次数 */
  remaining: number;
}

// ==================== 事件埋点 ====================

/**
 * 埋点事件类型
 */
export type AnalyticsEvent =
  | 'photo_uploaded'
  | 'persona_selected'
  | 'content_generated'
  | 'content_shared'
  | 'meme_created'
  | 'profile_created'
  | 'subscription_started';

/**
 * 埋点事件属性
 */
export interface AnalyticsEventProperties {
  photo_uploaded: {
    source: 'camera' | 'album';
    file_size: number;
    original_format?: string;
    compressed_size?: number;
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
    platform: string;
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

---

## 5. 常量配置

### 5.1 文件：`lib/constants/index.ts`

```typescript
// lib/constants/index.ts

export { PERSONAS, getBasicPersonas, getPremiumPersonas, getPersonaById, DEFAULT_PERSONA_ID } from './personas';
export { FONTS, DEFAULT_FONT_ID, getFontById } from './fonts';
export { FILTERS, DEFAULT_FILTER_ID } from './filters';
export { IMAGE_CONFIG } from './image';
export { ERROR_CODES, ERROR_MESSAGES, getErrorMessage } from './errors';
```

### 5.2 文件：`lib/constants/personas.ts`

```typescript
// lib/constants/personas.ts

import type { Persona, PresetPersonaId } from '@/types';

export const PERSONAS: Record<PresetPersonaId, Persona> = {
  // 基础人设（免费）
  'cold-boss': {
    id: 'cold-boss',
    name: '高冷总裁',
    icon: '👔',
    description: '霸道总裁附体，一切尽在掌控',
    prompt: '你是一只高冷的宠物，用霸道总裁的口吻说话，简短有力，带着不屑和傲慢',
    isPremium: false,
    category: 'basic',
  },
  'chatty-auntie': {
    id: 'chatty-auntie',
    name: '碎碎念大妈',
    icon: '👵',
    description: '操心的老母亲，絮絮叨叨停不下来',
    prompt: '你是一只爱操心的宠物，用大妈唠嗑的口吻，絮絮叨叨，充满生活气息',
    isPremium: false,
    category: 'basic',
  },
  'artistic-youth': {
    id: 'artistic-youth',
    name: '文艺青年',
    icon: '🎨',
    description: '诗和远方，45度角仰望天空',
    prompt: '你是一只文艺的宠物，用文艺青年的口吻，引用诗句，充满哲理和忧伤',
    isPremium: false,
    category: 'basic',
  },
  'hot-blood': {
    id: 'hot-blood',
    name: '热血少年',
    icon: '🔥',
    description: '燃烧吧小宇宙！永不放弃！',
    prompt: '你是一只热血的宠物，用热血少年的口吻，充满正能量和战斗力',
    isPremium: false,
    category: 'basic',
  },
  'sarcastic': {
    id: 'sarcastic',
    name: '毒舌吐槽',
    icon: '😏',
    description: '犀利点评，一针见血',
    prompt: '你是一只毒舌的宠物，用吐槽的口吻，犀利幽默，一针见血',
    isPremium: false,
    category: 'basic',
  },
  'humble-worker': {
    id: 'humble-worker',
    name: '卑微打工人',
    icon: '💼',
    description: '社畜日常，卑微又坚强',
    prompt: '你是一只打工人宠物，用卑微社畜的口吻，自嘲又无奈，充满打工人的心酸',
    isPremium: false,
    category: 'basic',
  },

  // 高级人设（付费）
  'zhenhuan': {
    id: 'zhenhuan',
    name: '甄嬛体',
    icon: '👑',
    description: '本宫乏了，臣妾做不到啊',
    prompt: '你是一只宫斗宠物，用甄嬛传的台词风格，古风华丽，充满宫斗气息',
    isPremium: true,
    category: 'premium',
  },
  'cyberpunk': {
    id: 'cyberpunk',
    name: '赛博朋克',
    icon: '🤖',
    description: '数据即生命，代码即灵魂',
    prompt: '你是一只赛博朋克宠物，用科幻术语和网络黑话，充满未来感',
    isPremium: true,
    category: 'premium',
  },
  'ceo-novel': {
    id: 'ceo-novel',
    name: '霸总文学',
    icon: '💎',
    description: '女人，你成功引起了我的注意',
    prompt: '你是一只霸总宠物，用网络霸总小说的台词风格，浮夸又土味',
    isPremium: true,
    category: 'premium',
  },
  'ancient-poem': {
    id: 'ancient-poem',
    name: '古风诗词',
    icon: '🏯',
    description: '白云千载空悠悠，铲屎官何处寻',
    prompt: '你是一只古风宠物，用古诗词的风格说话，意境优美，有文化底蕴',
    isPremium: true,
    category: 'premium',
  },
};

/**
 * 获取基础人设列表
 */
export function getBasicPersonas(): Persona[] {
  return Object.values(PERSONAS).filter((p) => !p.isPremium);
}

/**
 * 获取付费人设列表
 */
export function getPremiumPersonas(): Persona[] {
  return Object.values(PERSONAS).filter((p) => p.isPremium);
}

/**
 * 根据 ID 获取人设
 */
export function getPersonaById(id: string): Persona | undefined {
  return PERSONAS[id as PresetPersonaId];
}

/**
 * 默认人设 ID
 */
export const DEFAULT_PERSONA_ID: PresetPersonaId = 'cold-boss';
```

### 5.3 文件：`lib/constants/fonts.ts`

```typescript
// lib/constants/fonts.ts

import type { FontConfig } from '@/types';

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
    id: 'noto-sans',
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

export const DEFAULT_FONT_ID = 'maoken';

export function getFontById(id: string): FontConfig | undefined {
  return FONTS.find((f) => f.id === id);
}
```

### 5.4 文件：`lib/constants/filters.ts`

```typescript
// lib/constants/filters.ts

import type { FilterConfig } from '@/types';

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

export const DEFAULT_FILTER_ID = 'none';
```

### 5.5 文件：`lib/constants/image.ts`

```typescript
// lib/constants/image.ts

import type { ImageConfig } from '@/types';

export const IMAGE_CONFIG: ImageConfig = {
  maxSizeMB: 10,
  compressTargetMB: 1,
  acceptedTypes: ['image/jpeg', 'image/png', 'image/heic', 'image/heif'],
  maxWidthOrHeight: 2048,
};
```

### 5.6 文件：`lib/constants/errors.ts`

```typescript
// lib/constants/errors.ts

import type { ErrorCode } from '@/types/api';

export const ERROR_CODES = {
  // 上传错误
  UPLOAD_TOO_LARGE: 'UPLOAD_TOO_LARGE',
  UPLOAD_INVALID_FORMAT: 'UPLOAD_INVALID_FORMAT',
  UPLOAD_FAILED: 'UPLOAD_FAILED',

  // 生成错误
  GENERATE_NO_PET: 'GENERATE_NO_PET',
  GENERATE_TIMEOUT: 'GENERATE_TIMEOUT',
  GENERATE_FAILED: 'GENERATE_FAILED',
  GENERATE_CONTENT_BLOCKED: 'GENERATE_CONTENT_BLOCKED',

  // 限额错误
  LIMIT_EXCEEDED: 'LIMIT_EXCEEDED',

  // 网络错误
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',

  // 默认错误
  UNKNOWN: 'UNKNOWN',
} as const;

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  UPLOAD_TOO_LARGE: '图片过大，请上传小于 10MB 的图片',
  UPLOAD_INVALID_FORMAT: '不支持的图片格式，请上传 JPG、PNG 或 HEIC 格式',
  UPLOAD_FAILED: '图片上传失败，请检查网络后重试',

  GENERATE_NO_PET: '未检测到宠物，请上传包含宠物的照片',
  GENERATE_TIMEOUT: '生成超时，请重试',
  GENERATE_FAILED: 'AI 生成失败，请重试',
  GENERATE_CONTENT_BLOCKED: '生成内容不符合规范，已自动重新生成',

  LIMIT_EXCEEDED: '今日免费次数已用完，开通会员享无限次数',

  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器繁忙，请稍后重试',

  UNKNOWN: '发生未知错误，请重试',
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code as ErrorCode] || ERROR_MESSAGES.UNKNOWN;
}
```

---

## 6. Zod Schema

### 6.1 文件：`lib/validations/index.ts`

```typescript
// lib/validations/index.ts

export * from './generate';
export * from './upload';
export * from './user';
```

### 6.2 文件：`lib/validations/generate.ts`

```typescript
// lib/validations/generate.ts

import { z } from 'zod';

/**
 * 生成请求 Schema
 */
export const generateRequestSchema = z.object({
  imageBase64: z
    .string()
    .min(1, '图片数据不能为空')
    .refine(
      (val) => {
        // 检查是否是有效的 Base64
        try {
          atob(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: '无效的图片数据格式' }
    ),
  personaId: z.string().min(1, '请选择人设'),
  petProfileId: z.string().optional(),
});

/**
 * 内心戏 Schema
 */
export const monologueSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  tone: z.enum(['humorous', 'sarcastic', 'cute', 'dramatic', 'poetic']),
  length: z.enum(['short', 'medium', 'long']),
});

/**
 * 生成响应 Schema
 */
export const generateResponseSchema = z.object({
  monologues: z.array(monologueSchema).min(1).max(5),
  petType: z.enum(['cat', 'dog', 'other']),
  petBreed: z.string().optional(),
  emotion: z.enum([
    'happy',
    'angry',
    'sad',
    'surprised',
    'sleepy',
    'curious',
    'bored',
    'scared',
    'neutral',
  ]),
  generationTime: z.number().positive(),
});

export type GenerateRequestInput = z.infer<typeof generateRequestSchema>;
export type GenerateResponseOutput = z.infer<typeof generateResponseSchema>;
```

### 6.3 文件：`lib/validations/upload.ts`

```typescript
// lib/validations/upload.ts

import { z } from 'zod';
import { IMAGE_CONFIG } from '@/lib/constants';

/**
 * 文件校验 Schema
 */
export const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= IMAGE_CONFIG.maxSizeMB * 1024 * 1024,
    `图片大小不能超过 ${IMAGE_CONFIG.maxSizeMB}MB`
  )
  .refine(
    (file) =>
      IMAGE_CONFIG.acceptedTypes.includes(file.type) ||
      /\.(heic|heif)$/i.test(file.name),
    '不支持的图片格式'
  );

/**
 * 上传响应 Schema
 */
export const uploadResponseSchema = z.object({
  url: z.string().url(),
  key: z.string(),
  expiresAt: z.string().datetime(),
});

export type UploadResponseOutput = z.infer<typeof uploadResponseSchema>;
```

### 6.4 文件：`lib/validations/user.ts`

```typescript
// lib/validations/user.ts

import { z } from 'zod';

/**
 * 使用限额 Schema
 */
export const usageLimitSchema = z.object({
  used: z.number().int().min(0),
  limit: z.number().int().positive(),
  resetAt: z.string().datetime(),
  isPremium: z.boolean(),
});

/**
 * 使用一次响应 Schema
 */
export const useOnceResponseSchema = z.object({
  allowed: z.boolean(),
  remaining: z.number().int().min(0),
});

export type UsageLimitOutput = z.infer<typeof usageLimitSchema>;
export type UseOnceResponseOutput = z.infer<typeof useOnceResponseSchema>;
```

---

## 7. 验收标准

### 7.1 类型完整性

- [ ] 所有业务实体都有对应的 TypeScript 类型
- [ ] 所有 API 请求/响应都有类型定义
- [ ] 所有 UI 状态都有类型定义
- [ ] 类型之间的关联关系清晰

### 7.2 Schema 完整性

- [ ] 所有 API 请求都有 Zod Schema 校验
- [ ] 所有 API 响应都有 Zod Schema 校验
- [ ] Schema 能够生成对应的 TypeScript 类型
- [ ] 错误消息友好且明确

### 7.3 文件结构检查

```
types/
├── index.ts          # 核心业务类型 ⬜
└── api.ts            # API 相关类型 ⬜

lib/
├── constants/
│   ├── index.ts      # 常量导出 ⬜
│   ├── personas.ts   # 人设配置 ⬜
│   ├── fonts.ts      # 字体配置 ⬜
│   ├── filters.ts    # 滤镜配置 ⬜
│   ├── image.ts      # 图片配置 ⬜
│   └── errors.ts     # 错误码定义 ⬜
└── validations/
    ├── index.ts      # Schema 导出 ⬜
    ├── generate.ts   # 生成相关 Schema ⬜
    ├── upload.ts     # 上传相关 Schema ⬜
    └── user.ts       # 用户相关 Schema ⬜
```

### 7.4 检查清单

| 检查项 | 状态 |
| --- | --- |
| TypeScript 严格模式开启 | ⬜ |
| 所有类型导出正确 | ⬜ |
| Zod Schema 与类型一致 | ⬜ |
| 常量配置完整 | ⬜ |
| 错误码覆盖所有场景 | ⬜ |
| 类型文件无 lint 错误 | ⬜ |
| 运行 `pnpm tsc --noEmit` 无错误 | ⬜ |

---

## 执行顺序

1. 创建目录结构
   ```bash
   mkdir -p types lib/constants lib/validations
   ```

2. 创建类型文件
   - `types/index.ts`
   - `types/api.ts`

3. 创建常量配置
   - `lib/constants/personas.ts`
   - `lib/constants/fonts.ts`
   - `lib/constants/filters.ts`
   - `lib/constants/image.ts`
   - `lib/constants/errors.ts`
   - `lib/constants/index.ts`

4. 创建 Zod Schema
   - `lib/validations/generate.ts`
   - `lib/validations/upload.ts`
   - `lib/validations/user.ts`
   - `lib/validations/index.ts`

5. 验证类型导出
   ```bash
   pnpm tsc --noEmit
   ```

---

## 下一阶段

完成第二阶段后，进入 **第三阶段：环境搭建与全局配置（Infrastructure）**。

详见 [phase-3-infrastructure.md](./phase-3-infrastructure.md)
