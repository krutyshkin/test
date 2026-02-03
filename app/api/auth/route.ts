import { validate } from '@telegram-apps/init-data-node';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const payload = (await request.json()) as { initData?: string };
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const jwtSecret = process.env.JWT_SECRET;
  if (!botToken || !jwtSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!payload.initData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    validate(payload.initData, botToken, { expiresIn: 60 * 5 });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const params = new URLSearchParams(payload.initData);
  const userRaw = params.get('user');
  if (!userRaw) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = JSON.parse(userRaw) as { id: number; username?: string; photo_url?: string };

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username ?? null,
      photo_url: user.photo_url ?? null,
    },
    jwtSecret,
    { expiresIn: '7d' },
  );

  const response = NextResponse.json({ success: true });
  response.cookies.set('tg_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
  });
  return response;
}
