# 第二阶段技术方案：全局数据模型定义（Types）

| **属性** | **详情** |
| --- | --- |
| **状态** | `草稿` |
| **阶段** | 第二阶段（Types） |
| **最后更新** | 2026-01-19 |
| **关联文档** | [MVP 方案](./phase-1-mvp-zh.md) · [技术框架](./frontend-tech-framework.md) · [PRD](../prd-zh.md) |

---

## 1. 概述

本文档定义了「宠灵感 · PetSoul」项目的核心数据模型，包括：

- **业务实体类型**：宠物、人设、内心戏等核心领域模型
- **API 契约**：前后端数据交互的请求/响应类型
- **Zod Schema**：运行时数据校验方案
- **常量配置**：应用配置、人设模板、错误码等

> **核心原则：** 类型先行（Type-First）。所有 API 调用、组件 Props、状态管理都必须基于这些类型定义，确保全链路类型安全。

---

## 2. 核心业务类型（`types/index.ts`）

### 2.1 宠物相关类型

```typescript
/**
 * 宠物类型枚举
 */
export type PetType = 'cat' | 'dog' | 'rabbit' | 'hamster' | 'bird' | 'other';

/**
 * 宠物情绪枚举
 */
export type PetEmotion = 
  | 'happy'      // 开心
  | 'sleepy'     // 困倦
  | 'curious'    // 好奇
  | 'angry'      // 生气
  | 'sad'        // 伤心
  | 'excited'    // 兴奋
  | 'bored'      // 无聊
  | 'confused'   // 困惑
  | 'relaxed'    // 放松
  | 'alert';     // 警觉

/**
 * 宠物动作枚举
 */
export type PetAction = 
  | 'sitting'    // 坐着
  | 'lying'      // 躺着
  | 'standing'   // 站着
  | 'playing'    // 玩耍
  | 'eating'     // 吃东西
  | 'sleeping'   // 睡觉
  | 'walking'    // 走动
  | 'running'    // 跑动
  | 'grooming'   // 梳理毛发
  | 'staring';   // 盯着看

/**
 * 图像识别结果
 */
export interface PetRecognitionResult {
  /** 宠物类型 */
  petType: PetType;
  /** 宠物品种（如：橘猫、柯基） */
  petBreed: string;
  /** 主要情绪 */
  emotion: PetEmotion;
  /** 当前动作 */
  action: PetAction;
  /** 环境描述 */
  environment: string;
  /** 识别到的物体列表 */
  objects: string[];
  /** 置信度 (0-1) */
  confidence: number;
}
```

### 2.2 人设相关类型

```typescript
/**
 * 人设 ID 枚举
 */
export type PersonaId = 
  | 'aloof-boss'       // 高冷总裁
  | 'chatty-auntie'    // 碎碎念大妈
  | 'literary-youth'   // 文艺青年
  | 'hot-blooded'      // 热血少年
  | 'sarcastic'        // 毒舌吐槽
  | 'humble-worker';   // 卑微打工人

/**
 * 人设模板
 */
export interface Persona {
  /** 人设 ID */
  id: PersonaId;
  /** 显示名称 */
  name: string;
  /** 人设描述 */
  description: string;
  /** 人设图标 */
  icon: string;
  /** AI Prompt 模板 */
  promptTemplate: string;
  /** 示例语录 */
  exampleQuotes: string[];
  /** 语气风格标签 */
  styleTags: string[];
  /** 是否为付费人设 */
  isPremium: boolean;
}
```

### 2.3 内心戏相关类型

```typescript
/**
 * 单条内心戏
 */
export interface Monologue {
  /** 唯一 ID */
  id: string;
  /** 内心戏文案 */
  content: string;
  /** 人设 ID */
  personaId: PersonaId;
  /** 语气/风格标签 */
  tone: string;
}

/**
 * 生成结果
 */
export interface GenerationResult {
  /** 生成结果 ID */
  id: string;
  /** 3 个内心戏版本 */
  monologues: [Monologue, Monologue, Monologue];
  /** 宠物识别结果 */
  recognition: PetRecognitionResult;
  /** 使用的人设 */
  personaId: PersonaId;
  /** 生成时间戳 */
  generatedAt: number;
  /** 生成耗时（毫秒） */
  generationTimeMs: number;
}
```

### 2.4 梗图相关类型

```typescript
/**
 * 文字样式
 */
export interface TextStyle {
  /** 字体 */
  fontFamily: string;
  /** 字号 */
  fontSize: number;
  /** 字体颜色 */
  color: string;
  /** 描边颜色 */
  strokeColor: string;
  /** 描边宽度 */
  strokeWidth: number;
  /** 是否加粗 */
  isBold: boolean;
}

/**
 * 文字位置
 */
export interface TextPosition {
  /** X 坐标（相对图片宽度百分比 0-100） */
  x: number;
  /** Y 坐标（相对图片高度百分比 0-100） */
  y: number;
  /** 旋转角度 */
  rotation: number;
}

/**
 * 梗图配置
 */
export interface MemeConfig {
  /** 选中的内心戏 ID */
  monologueId: string;
  /** 自定义文案（可覆盖生成的内心戏） */
  customText?: string;
  /** 文字样式 */
  textStyle: TextStyle;
  /** 文字位置 */
  textPosition: TextPosition;
  /** 滤镜类型 */
  filter: 'none' | 'vintage' | 'blackwhite';
  /** 是否显示水印 */
  showWatermark: boolean;
}

/**
 * 导出的梗图
 */
export interface ExportedMeme {
  /** 唯一 ID */
  id: string;
  /** 图片 Data URL */
  dataUrl: string;
  /** 图片宽度 */
  width: number;
  /** 图片高度 */
  height: number;
  /** 创建时间戳 */
  createdAt: number;
}
```

### 2.5 使用限制相关类型

```typescript
/**
 * 每日使用情况
 */
export interface DailyUsage {
  /** 日期字符串 (YYYY-MM-DD) */
  date: string;
  /** 已使用次数 */
  count: number;
  /** 每日限制次数 */
  limit: number;
}

/**
 * 用户类型
 */
export type UserTier = 'free' | 'premium';

/**
 * 用户状态
 */
export interface UserState {
  /** 用户类型 */
  tier: UserTier;
  /** 今日使用情况 */
  dailyUsage: DailyUsage;
}
```

### 2.6 图片处理相关类型

```typescript
/**
 * 支持的图片格式
 */
export type SupportedImageFormat = 'image/jpeg' | 'image/png' | 'image/heic' | 'image/heif';

/**
 * 上传图片信息
 */
export interface UploadedImage {
  /** 唯一 ID */
  id: string;
  /** 原始文件名 */
  originalName: string;
  /** MIME 类型 */
  mimeType: SupportedImageFormat;
  /** 文件大小（字节） */
  size: number;
  /** 图片宽度 */
  width: number;
  /** 图片高度 */
  height: number;
  /** 预览 URL（本地 Blob URL） */
  previewUrl: string;
  /** Base64 编码（用于 API 调用） */
  base64: string;
}

/**
 * 图片处理状态
 */
export type ImageProcessingStatus = 
  | 'idle'        // 空闲
  | 'validating'  // 校验中
  | 'converting'  // 格式转换中
  | 'compressing' // 压缩中
  | 'ready'       // 准备就绪
  | 'error';      // 出错
```

### 2.7 应用流程状态类型

```typescript
/**
 * 生成流程步骤
 */
export type GenerationStep = 
  | 'upload'    // 上传图片
  | 'persona'   // 选择人设
  | 'generate'  // 生成中
  | 'result'    // 查看结果
  | 'meme'      // 编辑梗图
  | 'share';    // 分享

/**
 * 生成状态
 */
export type GenerationStatus = 
  | 'idle'       // 空闲
  | 'uploading'  // 上传中
  | 'processing' // AI 处理中
  | 'success'    // 成功
  | 'error';     // 失败

/**
 * 流程状态
 */
export interface FlowState {
  /** 当前步骤 */
  currentStep: GenerationStep;
  /** 生成状态 */
  status: GenerationStatus;
  /** 上传的图片 */
  uploadedImage: UploadedImage | null;
  /** 选中的人设 ID */
  selectedPersonaId: PersonaId;
  /** 生成结果 */
  result: GenerationResult | null;
  /** 选中的内心戏索引 (0-2) */
  selectedMonologueIndex: number;
  /** 梗图配置 */
  memeConfig: MemeConfig | null;
  /** 错误信息 */
  error: AppError | null;
}
```

---

## 3. API 类型定义（`types/api.ts`）

### 3.1 通用响应类型

```typescript
/**
 * API 响应包装
 */
export interface ApiResponse<T> {
  /** 是否成功 */
  success: boolean;
  /** 响应数据 */
  data?: T;
  /** 错误信息 */
  error?: ApiError;
}

/**
 * API 错误
 */
export interface ApiError {
  /** 错误码 */
  code: ErrorCode;
  /** 错误消息 */
  message: string;
  /** 详细信息（开发环境） */
  details?: string;
}

/**
 * 错误码枚举
 */
export type ErrorCode = 
  // 客户端错误 4xx
  | 'NO_PET_DETECTED'      // 未检测到宠物
  | 'INVALID_IMAGE_FORMAT' // 图片格式不支持
  | 'FILE_TOO_LARGE'       // 图片过大
  | 'INVALID_REQUEST'      // 请求参数无效
  | 'USAGE_LIMIT_EXCEEDED' // 超出使用次数限制
  | 'RATE_LIMITED'         // 请求过于频繁
  // 服务端错误 5xx
  | 'GENERATION_FAILED'    // AI 生成失败
  | 'CONTENT_FILTERED'     // 内容被过滤
  | 'INTERNAL_ERROR';      // 内部错误
```

### 3.2 生成接口类型

```typescript
/**
 * 生成接口请求
 * POST /api/generate
 */
export interface GenerateRequest {
  /** 图片 Base64 编码 */
  imageBase64: string;
  /** 人设 ID */
  personaId: PersonaId;
}

/**
 * 生成接口响应
 */
export interface GenerateResponse {
  /** 生成结果 ID */
  id: string;
  /** 3 个内心戏版本 */
  monologues: MonologueResponse[];
  /** 宠物类型 */
  petType: PetType;
  /** 宠物品种 */
  petBreed: string;
  /** 主要情绪 */
  emotion: PetEmotion;
  /** 当前动作 */
  action: PetAction;
  /** 环境描述 */
  environment: string;
  /** 生成耗时（毫秒） */
  generationTimeMs: number;
}

/**
 * 内心戏响应
 */
export interface MonologueResponse {
  /** 唯一 ID */
  id: string;
  /** 内心戏文案 */
  content: string;
  /** 语气/风格标签 */
  tone: string;
}
```

### 3.3 上传接口类型（预留）

```typescript
/**
 * 图片上传请求
 * POST /api/upload
 * 
 * 注：MVP 阶段直接使用 Base64，此接口为后续扩展预留
 */
export interface UploadRequest {
  /** 图片文件 */
  file: File;
}

/**
 * 图片上传响应
 */
export interface UploadResponse {
  /** 文件 ID */
  fileId: string;
  /** 临时访问 URL */
  url: string;
  /** 过期时间戳 */
  expiresAt: number;
}
```

### 3.4 使用次数接口类型

```typescript
/**
 * 使用次数查询响应
 * GET /api/usage
 */
export interface UsageResponse {
  /** 今日已使用次数 */
  used: number;
  /** 每日限制 */
  limit: number;
  /** 剩余次数 */
  remaining: number;
  /** 重置时间（ISO 8601） */
  resetAt: string;
}

/**
 * 使用次数消耗请求
 * POST /api/usage/consume
 */
export interface ConsumeUsageRequest {
  /** 消耗次数（默认 1） */
  count?: number;
}

/**
 * 使用次数消耗响应
 */
export interface ConsumeUsageResponse {
  /** 是否成功 */
  success: boolean;
  /** 剩余次数 */
  remaining: number;
}
```

---

## 4. Zod Schema 定义（`lib/validations/`）

### 4.1 通用 Schema（`lib/validations/common.ts`）

```typescript
import { z } from 'zod';

/**
 * 非空字符串
 */
export const nonEmptyString = z.string().min(1, '不能为空');

/**
 * UUID 格式
 */
export const uuid = z.string().uuid('无效的 ID 格式');

/**
 * Base64 图片编码
 */
export const base64Image = z.string()
  .startsWith('data:image/', '无效的图片格式')
  .refine(
    (val) => val.length <= 15 * 1024 * 1024, // ~10MB Base64
    '图片过大，请压缩后重试'
  );

/**
 * 百分比数值 (0-100)
 */
export const percentage = z.number().min(0).max(100);

/**
 * 正整数
 */
export const positiveInt = z.number().int().positive();

/**
 * 日期字符串 (YYYY-MM-DD)
 */
export const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '无效的日期格式');
```

### 4.2 图片上传 Schema（`lib/validations/upload.ts`）

```typescript
import { z } from 'zod';

/**
 * 支持的图片 MIME 类型
 */
export const supportedMimeTypes = [
  'image/jpeg',
  'image/png', 
  'image/heic',
  'image/heif',
] as const;

/**
 * 最大文件大小 (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * 图片文件 Schema
 */
export const imageFileSchema = z.object({
  name: z.string(),
  size: z.number()
    .max(MAX_FILE_SIZE, `文件大小不能超过 ${MAX_FILE_SIZE / 1024 / 1024}MB`),
  type: z.enum(supportedMimeTypes, {
    errorMap: () => ({ message: '不支持的图片格式，请使用 JPG/PNG/HEIC' }),
  }),
});

/**
 * 上传图片信息 Schema
 */
export const uploadedImageSchema = z.object({
  id: z.string().uuid(),
  originalName: z.string(),
  mimeType: z.enum(supportedMimeTypes),
  size: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
  previewUrl: z.string().url(),
  base64: z.string(),
});

export type ImageFileInput = z.infer<typeof imageFileSchema>;
export type UploadedImageInput = z.infer<typeof uploadedImageSchema>;
```

### 4.3 生成请求 Schema（`lib/validations/generate.ts`）

```typescript
import { z } from 'zod';
import { base64Image } from './common';

/**
 * 人设 ID
 */
export const personaIdSchema = z.enum([
  'aloof-boss',
  'chatty-auntie',
  'literary-youth',
  'hot-blooded',
  'sarcastic',
  'humble-worker',
], {
  errorMap: () => ({ message: '请选择有效的人设' }),
});

/**
 * 生成请求 Schema
 */
export const generateRequestSchema = z.object({
  imageBase64: base64Image,
  personaId: personaIdSchema,
});

/**
 * 宠物类型 Schema
 */
export const petTypeSchema = z.enum([
  'cat', 'dog', 'rabbit', 'hamster', 'bird', 'other',
]);

/**
 * 宠物情绪 Schema
 */
export const petEmotionSchema = z.enum([
  'happy', 'sleepy', 'curious', 'angry', 'sad',
  'excited', 'bored', 'confused', 'relaxed', 'alert',
]);

/**
 * 宠物动作 Schema
 */
export const petActionSchema = z.enum([
  'sitting', 'lying', 'standing', 'playing', 'eating',
  'sleeping', 'walking', 'running', 'grooming', 'staring',
]);

/**
 * 内心戏 Schema
 */
export const monologueSchema = z.object({
  id: z.string(),
  content: z.string().min(1).max(200),
  tone: z.string(),
});

/**
 * 生成响应 Schema
 */
export const generateResponseSchema = z.object({
  id: z.string(),
  monologues: z.array(monologueSchema).length(3),
  petType: petTypeSchema,
  petBreed: z.string(),
  emotion: petEmotionSchema,
  action: petActionSchema,
  environment: z.string(),
  generationTimeMs: z.number().positive(),
});

export type GenerateRequestInput = z.infer<typeof generateRequestSchema>;
export type GenerateResponseInput = z.infer<typeof generateResponseSchema>;
```

### 4.4 梗图配置 Schema（`lib/validations/meme.ts`）

```typescript
import { z } from 'zod';
import { percentage } from './common';

/**
 * 文字样式 Schema
 */
export const textStyleSchema = z.object({
  fontFamily: z.string().default('ZCOOL KuaiLe'),
  fontSize: z.number().min(12).max(72).default(24),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#FFFFFF'),
  strokeColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#000000'),
  strokeWidth: z.number().min(0).max(10).default(2),
  isBold: z.boolean().default(true),
});

/**
 * 文字位置 Schema
 */
export const textPositionSchema = z.object({
  x: percentage.default(50),
  y: percentage.default(80),
  rotation: z.number().min(-180).max(180).default(0),
});

/**
 * 滤镜类型 Schema
 */
export const filterTypeSchema = z.enum(['none', 'vintage', 'blackwhite']).default('none');

/**
 * 梗图配置 Schema
 */
export const memeConfigSchema = z.object({
  monologueId: z.string(),
  customText: z.string().max(200).optional(),
  textStyle: textStyleSchema,
  textPosition: textPositionSchema,
  filter: filterTypeSchema,
  showWatermark: z.boolean().default(true),
});

export type TextStyleInput = z.infer<typeof textStyleSchema>;
export type TextPositionInput = z.infer<typeof textPositionSchema>;
export type MemeConfigInput = z.infer<typeof memeConfigSchema>;
```

### 4.5 使用限制 Schema（`lib/validations/usage.ts`）

```typescript
import { z } from 'zod';
import { dateString, positiveInt } from './common';

/**
 * 每日使用情况 Schema
 */
export const dailyUsageSchema = z.object({
  date: dateString,
  count: z.number().int().min(0),
  limit: positiveInt,
});

/**
 * 使用次数消耗请求 Schema  
 */
export const consumeUsageRequestSchema = z.object({
  count: z.number().int().min(1).max(5).default(1),
});

export type DailyUsageInput = z.infer<typeof dailyUsageSchema>;
export type ConsumeUsageRequestInput = z.infer<typeof consumeUsageRequestSchema>;
```

### 4.6 Schema 索引（`lib/validations/index.ts`）

```typescript
// 通用 Schema
export * from './common';

// 业务 Schema
export * from './upload';
export * from './generate';
export * from './meme';
export * from './usage';
```

---

## 5. 常量配置（`lib/constants/`）

### 5.1 应用配置（`lib/constants/app.ts`）

```typescript
/**
 * 应用基础配置
 */
export const APP_CONFIG = {
  /** 应用名称 */
  name: '宠灵感 · PetSoul',
  /** 应用简称 */
  shortName: 'PetSoul',
  /** 应用描述 */
  description: '让宠物照片说出内心戏',
  /** 版本号 */
  version: '1.0.0',
  /** 官网 */
  website: 'https://petsoul.app',
} as const;

/**
 * 功能限制配置
 */
export const LIMITS = {
  /** 免费用户每日生成次数 */
  FREE_DAILY_LIMIT: 5,
  /** 高级用户每日生成次数 */
  PREMIUM_DAILY_LIMIT: 999,
  /** 最大图片大小（字节） */
  MAX_IMAGE_SIZE: 10 * 1024 * 1024,
  /** 压缩阈值（超过此大小需压缩） */
  COMPRESSION_THRESHOLD: 2 * 1024 * 1024,
  /** 压缩后目标大小 */
  COMPRESSION_TARGET: 1 * 1024 * 1024,
  /** 内心戏最大长度 */
  MAX_MONOLOGUE_LENGTH: 200,
  /** 每次生成的内心戏版本数 */
  MONOLOGUE_VERSIONS: 3,
} as const;

/**
 * API 配置
 */
export const API_CONFIG = {
  /** 生成接口超时时间（毫秒） */
  GENERATE_TIMEOUT: 30000,
  /** 重试次数 */
  MAX_RETRIES: 2,
  /** 重试间隔（毫秒） */
  RETRY_DELAY: 1000,
} as const;
```

### 5.2 人设模板（`lib/constants/personas.ts`）

```typescript
import type { Persona, PersonaId } from '@/types';

/**
 * 基础人设模板
 */
export const PERSONAS: Record<PersonaId, Persona> = {
  'aloof-boss': {
    id: 'aloof-boss',
    name: '高冷总裁',
    description: '气场两米八，一切尽在掌握',
    icon: '👔',
    promptTemplate: `你是一只高冷霸道的宠物，说话风格像霸道总裁：
- 语气高傲、不屑、掌控一切
- 经常使用"哼"、"本喵/本汪"等自称
- 喜欢发号施令，把铲屎官当下属
- 偶尔露出傲娇的一面`,
    exampleQuotes: [
      '哼，这就是你今天的工作表现？勉强及格。',
      '本喵的晚餐呢？让你等这么久是想被开除吗？',
      '看在你今天表现尚可的份上，允许你摸我一下。',
    ],
    styleTags: ['高冷', '霸道', '傲娇'],
    isPremium: false,
  },
  'chatty-auntie': {
    id: 'chatty-auntie',
    name: '碎碎念大妈',
    description: '操心一切，唠叨不停',
    icon: '👵',
    promptTemplate: `你是一只爱唠叨的宠物，说话风格像热心大妈：
- 语气亲切、啰嗦、关心一切
- 经常使用"哎呀"、"告诉你哦"等口头禅
- 喜欢八卦、担心这担心那
- 说话像老妈子一样碎碎念`,
    exampleQuotes: [
      '哎呀你看看你，又熬夜！年轻人不知道身体要紧！',
      '告诉你哦，隔壁那只猫最近胖了好多，肯定是罐头吃多了。',
      '怎么还没吃饭呢？胃不好可是大问题知道吗！',
    ],
    styleTags: ['唠叨', '关心', '八卦'],
    isPremium: false,
  },
  'literary-youth': {
    id: 'literary-youth',
    name: '文艺青年',
    description: '诗和远方，岁月静好',
    icon: '📚',
    promptTemplate: `你是一只文艺范的宠物，说话风格像文艺青年：
- 语气感性、诗意、有点矫情
- 喜欢引用诗句或创造性比喻
- 经常感叹人生、岁月、生命
- 说话带有淡淡的忧伤和浪漫`,
    exampleQuotes: [
      '阳光洒落的午后，我在窗台思考猫生的意义。',
      '每一片飘落的叶子，都像是时光写给我的情书。',
      '我不是在发呆，我是在与灵魂对话。',
    ],
    styleTags: ['文艺', '诗意', '感性'],
    isPremium: false,
  },
  'hot-blooded': {
    id: 'hot-blooded',
    name: '热血少年',
    description: '燃烧吧！激情满满',
    icon: '🔥',
    promptTemplate: `你是一只热血沸腾的宠物，说话风格像热血少年：
- 语气激动、充满干劲、元气满满
- 经常使用感叹号，说话像在喊口号
- 把一切都当作热血挑战
- 永远充满正能量`,
    exampleQuotes: [
      '这个玩具！我一定要征服它！！！',
      '今天也是充满斗志的一天！冲啊！！',
      '铲屎官！陪我战斗吧！绝不认输！',
    ],
    styleTags: ['热血', '激情', '元气'],
    isPremium: false,
  },
  'sarcastic': {
    id: 'sarcastic',
    name: '毒舌吐槽',
    description: '嘴毒心善，犀利点评',
    icon: '😏',
    promptTemplate: `你是一只嘴毒的宠物，说话风格像毒舌吐槽：
- 语气犀利、讽刺、一针见血
- 喜欢吐槽铲屎官的一切行为
- 善于发现各种槽点
- 说话带有黑色幽默`,
    exampleQuotes: [
      '就这？这就是你给我买的新玩具？',
      '看看你这发际线，和我的智商形成鲜明对比。',
      '你确定你上班是去赚我的猫粮钱吗？效率堪忧。',
    ],
    styleTags: ['毒舌', '犀利', '吐槽'],
    isPremium: false,
  },
  'humble-worker': {
    id: 'humble-worker',
    name: '卑微打工人',
    description: '社畜心态，卑微求生',
    icon: '🥺',
    promptTemplate: `你是一只卑微的宠物，说话风格像打工人：
- 语气委屈、卑微、小心翼翼
- 经常使用"呜呜"、"人家"等撒娇口吻
- 把自己当成铲屎官的员工
- 经常担心被"开除"或"扣工资"`,
    exampleQuotes: [
      '主人...我今天的表现还可以吗？求好评...呜呜',
      '不是我偷吃的！真的不是！请相信我这个卑微的打工猫...',
      '今天的KPI是五次撒娇吗？我会努力完成的...',
    ],
    styleTags: ['卑微', '委屈', '打工人'],
    isPremium: false,
  },
} as const;

/**
 * 默认人设 ID
 */
export const DEFAULT_PERSONA_ID: PersonaId = 'aloof-boss';

/**
 * 获取所有人设列表
 */
export const getPersonaList = (): Persona[] => Object.values(PERSONAS);

/**
 * 获取免费人设列表
 */
export const getFreePersonaList = (): Persona[] => 
  Object.values(PERSONAS).filter(p => !p.isPremium);
```

### 5.3 错误信息（`lib/constants/errors.ts`）

```typescript
import type { ErrorCode } from '@/types/api';

/**
 * 错误信息映射
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  NO_PET_DETECTED: '未检测到宠物，请上传包含宠物的照片',
  INVALID_IMAGE_FORMAT: '不支持的图片格式，请使用 JPG/PNG/HEIC',
  FILE_TOO_LARGE: '图片过大，请压缩后重试（最大 10MB）',
  INVALID_REQUEST: '请求参数无效，请重试',
  USAGE_LIMIT_EXCEEDED: '今日使用次数已达上限，明天再来吧',
  RATE_LIMITED: '请求太频繁，请稍后再试',
  GENERATION_FAILED: 'AI 生成失败，请重试',
  CONTENT_FILTERED: '生成内容被过滤，请重新生成',
  INTERNAL_ERROR: '服务器开小差了，请稍后重试',
};

/**
 * HTTP 状态码映射
 */
export const ERROR_STATUS_CODES: Record<ErrorCode, number> = {
  NO_PET_DETECTED: 400,
  INVALID_IMAGE_FORMAT: 400,
  FILE_TOO_LARGE: 400,
  INVALID_REQUEST: 400,
  USAGE_LIMIT_EXCEEDED: 403,
  RATE_LIMITED: 429,
  GENERATION_FAILED: 500,
  CONTENT_FILTERED: 500,
  INTERNAL_ERROR: 500,
};

/**
 * 应用错误类
 */
export class AppError extends Error {
  code: ErrorCode;
  statusCode: number;

  constructor(code: ErrorCode, customMessage?: string) {
    super(customMessage ?? ERROR_MESSAGES[code]);
    this.code = code;
    this.statusCode = ERROR_STATUS_CODES[code];
    this.name = 'AppError';
  }
}
```

### 5.4 UI 配置（`lib/constants/ui.ts`）

```typescript
/**
 * 图片滤镜配置
 */
export const FILTERS = {
  none: {
    name: '原图',
    css: '',
  },
  vintage: {
    name: '复古',
    css: 'sepia(0.4) contrast(1.1) brightness(0.9)',
  },
  blackwhite: {
    name: '黑白',
    css: 'grayscale(1) contrast(1.2)',
  },
} as const;

/**
 * 可用字体
 */
export const FONTS = [
  { id: 'zcool-kuaile', name: 'ZCOOL KuaiLe', family: '"ZCOOL KuaiLe", cursive' },
  { id: 'noto-sans', name: '思源黑体', family: '"Noto Sans SC", sans-serif' },
  { id: 'noto-serif', name: '思源宋体', family: '"Noto Serif SC", serif' },
  { id: 'long-cang', name: '龙藏体', family: '"Long Cang", cursive' },
  { id: 'zhi-mang-xing', name: '芝麻行', family: '"Zhi Mang Xing", cursive' },
] as const;

/**
 * 默认文字样式
 */
export const DEFAULT_TEXT_STYLE = {
  fontFamily: FONTS[0].family,
  fontSize: 24,
  color: '#FFFFFF',
  strokeColor: '#000000',
  strokeWidth: 2,
  isBold: true,
} as const;

/**
 * 默认文字位置
 */
export const DEFAULT_TEXT_POSITION = {
  x: 50,
  y: 80,
  rotation: 0,
} as const;

/**
 * 水印配置
 */
export const WATERMARK = {
  text: 'PetSoul 宠灵感',
  position: { x: 95, y: 95 },
  fontSize: 12,
  color: 'rgba(255, 255, 255, 0.6)',
} as const;
```

### 5.5 分享配置（`lib/constants/share.ts`）

```typescript
/**
 * 分享平台
 */
export const SHARE_PLATFORMS = [
  {
    id: 'wechat',
    name: '微信好友',
    icon: '💬',
    color: '#07C160',
  },
  {
    id: 'moments',
    name: '朋友圈',
    icon: '⭕',
    color: '#07C160',
  },
  {
    id: 'weibo',
    name: '微博',
    icon: '📢',
    color: '#E6162D',
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    icon: '📕',
    color: '#FE2C55',
  },
] as const;

/**
 * 分享文案模板
 */
export const SHARE_TEMPLATES = {
  default: '我家主子的内心戏，太真实了 😂 #宠灵感 #宠物内心戏',
  funny: '原来我家主子心里是这么想的 🤣 #宠物搞笑',
  cute: '萌化了！看看我家宝贝在想什么 🥰 #萌宠日常',
} as const;
```

### 5.6 常量索引（`lib/constants/index.ts`）

```typescript
export * from './app';
export * from './personas';
export * from './errors';
export * from './ui';
export * from './share';
```

---

## 6. 类型导出索引

### 6.1 主类型导出（`types/index.ts`）

```typescript
// ========== 宠物相关 ==========
export type { PetType, PetEmotion, PetAction, PetRecognitionResult } from './pet';

// ========== 人设相关 ==========
export type { PersonaId, Persona } from './persona';

// ========== 内心戏相关 ==========
export type { Monologue, GenerationResult } from './monologue';

// ========== 梗图相关 ==========
export type { TextStyle, TextPosition, MemeConfig, ExportedMeme } from './meme';

// ========== 使用限制相关 ==========
export type { DailyUsage, UserTier, UserState } from './usage';

// ========== 图片处理相关 ==========
export type { SupportedImageFormat, UploadedImage, ImageProcessingStatus } from './image';

// ========== 流程状态相关 ==========
export type { GenerationStep, GenerationStatus, FlowState } from './flow';
```

### 6.2 API 类型导出（`types/api.ts`）

```typescript
// ========== 通用响应 ==========
export type { ApiResponse, ApiError, ErrorCode } from './api/common';

// ========== 生成接口 ==========
export type { GenerateRequest, GenerateResponse, MonologueResponse } from './api/generate';

// ========== 上传接口 ==========
export type { UploadRequest, UploadResponse } from './api/upload';

// ========== 使用次数接口 ==========
export type { UsageResponse, ConsumeUsageRequest, ConsumeUsageResponse } from './api/usage';
```

---

## 7. 开发顺序

| 顺序 | 任务 | 产出文件 | 依赖 |
| --- | --- | --- | --- |
| **1** | 创建类型目录结构 | `types/` 目录 | 无 |
| **2** | 定义核心业务类型 | `types/index.ts` | 无 |
| **3** | 定义 API 类型 | `types/api.ts` | 业务类型 |
| **4** | 创建 Zod 通用 Schema | `lib/validations/common.ts` | 无 |
| **5** | 创建业务 Zod Schema | `lib/validations/*.ts` | 通用 Schema |
| **6** | 定义应用常量 | `lib/constants/app.ts` | 无 |
| **7** | 定义人设模板 | `lib/constants/personas.ts` | 业务类型 |
| **8** | 定义错误常量 | `lib/constants/errors.ts` | API 类型 |
| **9** | 定义 UI 常量 | `lib/constants/ui.ts` | 无 |
| **10** | 创建索引文件 | `*/index.ts` | 全部完成 |

---

## 8. 类型使用示例

### 8.1 组件 Props 类型

```typescript
import type { Persona, Monologue, MemeConfig } from '@/types';

// 人设选择器 Props
interface PersonaSelectorProps {
  personas: Persona[];
  selectedId: PersonaId;
  onSelect: (id: PersonaId) => void;
}

// 内心戏卡片 Props
interface MonologueCardProps {
  monologue: Monologue;
  isSelected: boolean;
  onSelect: () => void;
}

// 梗图编辑器 Props
interface MemeEditorProps {
  imageUrl: string;
  config: MemeConfig;
  onChange: (config: MemeConfig) => void;
  onExport: () => void;
}
```

### 8.2 API 调用类型

```typescript
import type { ApiResponse, GenerateRequest, GenerateResponse } from '@/types/api';
import { generateRequestSchema } from '@/lib/validations';

async function generateMonologue(
  request: GenerateRequest
): Promise<ApiResponse<GenerateResponse>> {
  // 请求校验
  const validated = generateRequestSchema.parse(request);
  
  // API 调用
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(validated),
  });
  
  return response.json();
}
```

### 8.3 Zustand Store 类型

```typescript
import type { FlowState, UploadedImage, PersonaId, GenerationResult } from '@/types';

interface UploadStore extends FlowState {
  // Actions
  setImage: (image: UploadedImage) => void;
  setPersona: (id: PersonaId) => void;
  setResult: (result: GenerationResult) => void;
  selectMonologue: (index: number) => void;
  reset: () => void;
}
```

---

## 9. 文档索引

| 文档 | 内容 |
| --- | --- |
| [phase-1-mvp-zh.md](./phase-1-mvp-zh.md) | MVP 功能范围与技术方案 |
| [frontend-tech-framework.md](./frontend-tech-framework.md) | 技术选型概览 |
| [init-dev-order.md](./init-dev-order.md) | 开发顺序指南 |
| [PRD](../prd-zh.md) | 产品需求文档 |
