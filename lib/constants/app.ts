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
