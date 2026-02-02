import { NextResponse } from 'next/server';
import { listMarketItems } from '@/lib/db';

export async function GET() {
  const items = await listMarketItems();
  return NextResponse.json(items);
}
