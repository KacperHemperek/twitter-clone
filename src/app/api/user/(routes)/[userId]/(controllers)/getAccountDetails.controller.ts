import { NextRequest, NextResponse } from 'next/server';

export async function getAccountDetailsController(
  req: NextRequest,
  userId: string
) {
  return NextResponse.json({ ok: true });
}
