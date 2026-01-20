import type { ErrorCode } from '@/types/api';
import { AppError } from '@/types';

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
 * 创建应用错误
 */
export function createAppError(code: ErrorCode, customMessage?: string) {
  return new AppError(
    code,
    customMessage ?? ERROR_MESSAGES[code],
    ERROR_STATUS_CODES[code]
  );
}
