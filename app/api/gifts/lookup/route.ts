import { NextResponse } from 'next/server';

const BASE_URL = 'https://cdn.changes.tg/gifts';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gift = searchParams.get('gift');
  if (!gift) {
    return NextResponse.json({ error: 'Missing gift parameter' }, { status: 400 });
  }

  const response = await fetch(`${BASE_URL}/gift/${encodeURIComponent(gift)}`);
  if (!response.ok) {
    return NextResponse.json({ error: 'Gift not found' }, { status: 404 });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
