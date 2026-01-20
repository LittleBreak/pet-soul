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
  type: z.enum(supportedMimeTypes, { error: '不支持的图片格式，请使用 JPG/PNG/HEIC' }),
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
