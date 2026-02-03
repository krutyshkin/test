import { NextResponse } from 'next/server';
import { verifyLoginWidget } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const payload = (await request.json()) as Record<string, string | number | undefined>;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const normalized = {
    id: Number(payload.id),
    first_name: payload.first_name ? String(payload.first_name) : undefined,
    last_name: payload.last_name ? String(payload.last_name) : undefined,
    username: payload.username ? String(payload.username) : undefined,
    photo_url: payload.photo_url ? String(payload.photo_url) : undefined,
    auth_date: Number(payload.auth_date),
    hash: payload.hash ? String(payload.hash) : '',
  };
  const verified = verifyLoginWidget(normalized, botToken);
  if (!verified) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(
    'tg_login',
    JSON.stringify({
      id: verified.id,
      username: verified.username ?? null,
      photo_url: verified.photo_url ?? null,
    }),
    {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    },
  );
  return response;
}
