import { cookies, headers } from 'next/headers';
import { verifyInitData } from './telegram';

export function getInitData() {
  const headerInitData = headers().get('x-telegram-init-data');
  const cookieInitData = cookies().get('tg_init_data')?.value;
  return headerInitData ?? cookieInitData ?? '';
}

export function requireTelegramUser() {
  const initData = getInitData();
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error('Missing TELEGRAM_BOT_TOKEN');
  }
  const user = verifyInitData(initData, botToken);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
