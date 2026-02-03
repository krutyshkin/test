import crypto from 'crypto';

export type TelegramUser = {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
};

export function parseInitData(initData: string) {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) {
    return null;
  }

  params.delete('hash');

  const dataCheckString = Array.from(params.keys())
    .sort()
    .map((key) => `${key}=${params.get(key)}`)
    .join('\n');

  return { hash, dataCheckString, params };
}

export function verifyInitData(initData: string, botToken: string) {
  const parsed = parseInitData(initData);
  if (!parsed) {
    return null;
  }

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const signature = crypto.createHmac('sha256', secretKey).update(parsed.dataCheckString).digest('hex');

  if (signature !== parsed.hash) {
    return null;
  }

  const userRaw = parsed.params.get('user');
  if (!userRaw) {
    return null;
  }

  try {
    const user = JSON.parse(userRaw) as TelegramUser;
    return user;
  } catch {
    return null;
  }
}

export function isAdmin(telegramId: number, adminList: string | undefined) {
  if (!adminList) {
    return false;
  }
  return adminList
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
    .includes(String(telegramId));
}

export type TelegramLoginPayload = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

export function verifyLoginWidget(payload: TelegramLoginPayload, botToken: string) {
  const { hash, ...data } = payload;
  const checkString = Object.entries(data)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n');

  const secret = crypto.createHash('sha256').update(botToken).digest();
  const signature = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
  if (signature !== hash) {
    return null;
  }

  return {
    id: payload.id,
    username: payload.username,
    first_name: payload.first_name,
    last_name: payload.last_name,
    photo_url: payload.photo_url,
  };
}
