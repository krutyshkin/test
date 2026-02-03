import { NextResponse } from 'next/server';
import { listMarketItems } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const items = await listMarketItems();
  return NextResponse.json(items);
}
