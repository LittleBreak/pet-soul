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
