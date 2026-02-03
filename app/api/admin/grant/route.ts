import { NextResponse } from 'next/server';
import { requireTelegramUser } from '@/lib/auth';
import { isAdmin } from '@/lib/telegram';
import { grantGiftSchema } from '@/lib/validation';
import { getUserByTelegramId, grantGift } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const admin = requireTelegramUser();
    if (!isAdmin(admin.id, process.env.ADMIN_IDS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const payload = grantGiftSchema.parse(await request.json());
    const user = await getUserByTelegramId(payload.telegramId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await grantGift(user.id, payload.giftName, payload.previewUrl ?? null);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
