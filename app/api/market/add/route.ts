import { NextResponse } from 'next/server';
import { addMarketItem } from '@/lib/db';
import { requireTelegramUser } from '@/lib/auth';
import { isAdmin } from '@/lib/telegram';
import { addGiftSchema } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const user = requireTelegramUser();
    if (!isAdmin(user.id, process.env.ADMIN_IDS)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const payload = addGiftSchema.parse(await request.json());
    const created = await addMarketItem({
      giftName: payload.giftName,
      priceStars: payload.priceStars,
      allowUpgrade: payload.allowUpgrade,
      allowAuction: payload.allowAuction,
      previewUrl: payload.previewUrl ?? null,
    });
    return NextResponse.json({ id: created.id });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
