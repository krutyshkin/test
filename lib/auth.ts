import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

type JwtPayload = {
  id: number;
  username?: string | null;
  photo_url?: string | null;
};

export function requireTelegramUser() {
  const token = cookies().get('tg_token')?.value;
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) {
    throw new Error('Unauthorized');
  }
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw new Error('Unauthorized');
  }
}
