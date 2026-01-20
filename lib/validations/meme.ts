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
