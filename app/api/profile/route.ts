import { NextResponse } from 'next/server';
import { ensureUser, listUserGifts, query } from '@/lib/db';
import { requireTelegramUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = requireTelegramUser();
    const dbUser = await ensureUser(user.id, user.username ?? null, user.photo_url ?? null);

    const profile = await query<{
      id: string;
      telegram_id: number;
      username: string | null;
      avatar_url: string | null;
      balance_stars: number;
    }>`SELECT id, telegram_id, username, avatar_url, balance_stars FROM users WHERE id = ${dbUser.id}`;

    const gifts = await listUserGifts(dbUser.id);

    return NextResponse.json({ user: profile.rows[0], gifts });
  } catch {
    return NextResponse.json({ user: null, gifts: [] }, { status: 200 });
  }
}
