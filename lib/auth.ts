import { cookies } from 'next/headers';

export function requireTelegramUser() {
  const cookie = cookies().get('tg_login')?.value;
  if (!cookie) {
    throw new Error('Unauthorized');
  }
  try {
    return JSON.parse(cookie) as { id: number; username?: string | null; photo_url?: string | null };
  } catch {
    throw new Error('Unauthorized');
  }
}
