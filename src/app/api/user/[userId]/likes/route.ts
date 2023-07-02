import { getLikedTweetsHandler } from '@/app/api/user/[userId]/likes/(controller)/getLikedTweets.controller';
import { NextRequest, NextResponse } from 'next/server';

export function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  return getLikedTweetsHandler(req, params.userId);
}
