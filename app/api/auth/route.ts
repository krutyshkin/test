import { NextResponse } from 'next/server';
import { verifyInitData } from '@/lib/telegram';

export async function POST(request: Request) {
  const { initData } = (await request.json()) as { initData?: string };
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken || !initData || !verifyInitData(initData, botToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('tg_init_data', initData, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
  });
  return response;
}
