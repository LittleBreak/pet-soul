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
