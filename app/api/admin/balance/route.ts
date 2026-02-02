import { NextResponse } from 'next/server';
import { requireTelegramUser } from '@/lib/auth';
import { isAdmin } from '@/lib/telegram';
import { balanceSchema } from '@/lib/validation';
import { getUserByTelegramId, updateUserBalance } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const admin = requireTelegramUser();
    if (!isAdmin(admin.id, process.env.ADMIN_IDS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const payload = balanceSchema.parse(await request.json());
    const user = await getUserByTelegramId(payload.telegramId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updated = await updateUserBalance(user.id, payload.delta);
    return NextResponse.json({ balance_stars: updated.balance_stars });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
