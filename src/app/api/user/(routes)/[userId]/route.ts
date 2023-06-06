import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest, params: { userId: string }) {
  console.log({ userId: params.userId });

  return NextResponse.json({ ok: true });
}
