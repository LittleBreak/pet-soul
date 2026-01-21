/**
 * PetSoul - Core Business Types
 * 核心业务类型定义
 */

// ========== 宠物相关类型 ==========

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

// ========== 人设相关类型 ==========

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

// ========== 内心戏相关类型 ==========

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

// ========== 梗图相关类型 ==========

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

// ========== 使用限制相关类型 ==========

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
 * 用户基本信息
 */
export interface UserProfile {
  id: string;
  nickname: string;
  avatarUrl?: string;
}

/**
 * 用户状态
 */
export interface UserState {
  /** 用户基本信息 */
  profile?: UserProfile;
  /** 用户类型 */
  tier: UserTier;
  /** 今日使用情况 */
  dailyUsage: DailyUsage;
}

// ========== 图片处理相关类型 ==========

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

// ========== 应用流程状态类型 ==========

/**
 * 生成流程步骤
 */
export type GenerationStep =
  | 'upload'    // 初始/上传态
  | 'persona'   // 人设选择态
  | 'result';   // 结果与编辑态

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

// ========== 错误类型 ==========

import type { ErrorCode } from './api';

/**
 * 应用错误类
 */
export class AppError extends Error {
  code: ErrorCode;
  statusCode: number;

  constructor(code: ErrorCode, message: string, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}
