import { NextRequest } from 'next/server';

import { retweetHandler } from '@/app/api/tweets/[postId]/retweet/(controllers)/retweet.controller';

import { apiHandler } from '@/lib/serverError';

export function POST(req: NextRequest, params: { params: { postId: string } }) {
  return apiHandler(retweetHandler, req, params);
}
