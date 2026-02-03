import { NextResponse } from 'next/server';
import { requireTelegramUser } from '@/lib/auth';
import { isAdmin } from '@/lib/telegram';
import { revokeGiftSchema } from '@/lib/validation';
import { getUserByTelegramId, revokeGift } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const admin = requireTelegramUser();
    if (!isAdmin(admin.id, process.env.ADMIN_IDS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const payload = revokeGiftSchema.parse(await request.json());
    const user = await getUserByTelegramId(payload.telegramId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await revokeGift(user.id, payload.giftName);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
