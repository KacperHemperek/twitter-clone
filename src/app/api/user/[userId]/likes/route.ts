import { getLikedTweetsHandler } from '@/app/api/user/[userId]/likes/(controller)/getLikedTweets.controller';
import { NextRequest, NextResponse } from 'next/server';

import { apiHandler } from '@/lib/server';

export function GET(req: NextRequest, params: { params: { userId: string } }) {
  return apiHandler(getLikedTweetsHandler, req, params);
}
