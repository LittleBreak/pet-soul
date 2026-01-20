/**
 * PetSoul - API Types
 * API 类型定义
 */

import type { PetType, PetEmotion, PetAction, PersonaId } from './index';

// ========== 通用响应类型 ==========

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

// ========== 生成接口类型 ==========

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

// ========== 上传接口类型（预留） ==========

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

// ========== 使用次数接口类型 ==========

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
