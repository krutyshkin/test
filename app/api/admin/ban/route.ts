import { NextResponse } from 'next/server';
import { requireTelegramUser } from '@/lib/auth';
import { isAdmin } from '@/lib/telegram';
import { banSchema } from '@/lib/validation';
import { setUserBan } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const admin = requireTelegramUser();
    if (!isAdmin(admin.id, process.env.ADMIN_IDS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const payload = banSchema.parse(await request.json());
    await setUserBan(payload.telegramId, payload.isBanned);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
