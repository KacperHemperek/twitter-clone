import { NextRequest } from 'next/server';

import { retweetHandler } from '@/app/api/tweets/[postId]/retweet/(controllers)/retweet.controller';

export function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  return retweetHandler(req, params.postId);
}
