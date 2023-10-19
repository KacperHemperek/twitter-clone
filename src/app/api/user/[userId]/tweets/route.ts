import { NextRequest } from 'next/server';

import { getUserTweetsHandler } from '@/app/api/user/[userId]/tweets/(controllers)/getUserTweets.controller';

import { apiHandler } from '@/lib/server';

export type AccountParams = {
  userId: string;
};

export function GET(
  req: NextRequest,
  params: {
    params: AccountParams;
  }
) {
  return apiHandler(getUserTweetsHandler, req, params);
}
