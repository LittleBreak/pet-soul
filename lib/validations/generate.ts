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
], { error: '请选择有效的人设' });

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
