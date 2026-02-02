import { sql } from '@vercel/postgres';

export async function query<T>(strings: TemplateStringsArray, ...values: unknown[]) {
  return sql<T>(strings, ...values);
}

export async function getUserByTelegramId(telegramId: number) {
  const result = await query<{ id: string; telegram_id: number; is_banned: boolean }>
    `SELECT id, telegram_id, is_banned FROM users WHERE telegram_id = ${telegramId}`;
  return result.rows[0] ?? null;
}

export async function ensureUser(telegramId: number, username: string | null, avatarUrl: string | null) {
  const result = await query<{ id: string; telegram_id: number; is_banned: boolean }>
    `INSERT INTO users (telegram_id, username, avatar_url)
     VALUES (${telegramId}, ${username}, ${avatarUrl})
     ON CONFLICT (telegram_id)
     DO UPDATE SET username = EXCLUDED.username, avatar_url = EXCLUDED.avatar_url
     RETURNING id, telegram_id, is_banned`;
  return result.rows[0];
}

export async function listMarketItems() {
  const result = await query<{
    id: string;
    gift_name: string;
    price_stars: number;
    allow_upgrade: boolean;
    allow_auction: boolean;
    preview_url: string | null;
  }>`SELECT id, gift_name, price_stars, allow_upgrade, allow_auction, preview_url
     FROM market_items
     WHERE is_active = true
     ORDER BY created_at DESC`;
  return result.rows;
}

export async function listUserGifts(userId: string) {
  const result = await query<{
    id: string;
    gift_name: string;
    preview_url: string | null;
    acquired_at: Date;
  }>`SELECT id, gift_name, preview_url, acquired_at
     FROM user_gifts
     WHERE user_id = ${userId}
     ORDER BY acquired_at DESC`;
  return result.rows;
}

export async function addMarketItem(input: {
  giftName: string;
  priceStars: number;
  allowUpgrade: boolean;
  allowAuction: boolean;
  previewUrl: string | null;
}) {
  const result = await query<{ id: string }>
    `INSERT INTO market_items (gift_name, price_stars, allow_upgrade, allow_auction, preview_url)
     VALUES (${input.giftName}, ${input.priceStars}, ${input.allowUpgrade}, ${input.allowAuction}, ${input.previewUrl})
     RETURNING id`;
  return result.rows[0];
}

export async function updateUserBalance(userId: string, delta: number) {
  const result = await query<{ balance_stars: number }>
    `UPDATE users
     SET balance_stars = balance_stars + ${delta}
     WHERE id = ${userId}
     RETURNING balance_stars`;
  return result.rows[0];
}

export async function setUserBan(telegramId: number, isBanned: boolean) {
  await query`UPDATE users SET is_banned = ${isBanned} WHERE telegram_id = ${telegramId}`;
}

export async function grantGift(userId: string, giftName: string, previewUrl: string | null) {
  await query`INSERT INTO user_gifts (user_id, gift_name, preview_url)
              VALUES (${userId}, ${giftName}, ${previewUrl})`;
}

export async function revokeGift(userId: string, giftName: string) {
  await query`DELETE FROM user_gifts WHERE user_id = ${userId} AND gift_name = ${giftName}`;
}
