import { z } from 'zod';

export const addGiftSchema = z.object({
  giftName: z.string().min(2).max(80),
  priceStars: z.number().int().min(1).max(1_000_000),
  allowUpgrade: z.boolean().default(false),
  allowAuction: z.boolean().default(false),
  previewUrl: z.string().url().optional().nullable(),
});

export const balanceSchema = z.object({
  telegramId: z.number().int(),
  delta: z.number().int().min(-1_000_000).max(1_000_000),
});

export const banSchema = z.object({
  telegramId: z.number().int(),
  isBanned: z.boolean(),
});

export const grantGiftSchema = z.object({
  telegramId: z.number().int(),
  giftName: z.string().min(2).max(80),
  previewUrl: z.string().url().optional().nullable(),
});

export const revokeGiftSchema = z.object({
  telegramId: z.number().int(),
  giftName: z.string().min(2).max(80),
});
