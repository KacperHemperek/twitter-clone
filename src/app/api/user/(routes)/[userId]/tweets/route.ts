import { NextRequest } from 'next/server';

import { getUserTweetsHandler } from '@/app/api/user/(routes)/[userId]/tweets/(controllers)/getUserTweets.controller';

type AccountParams = {
  userId: string;
};

export function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: AccountParams;
  }
) {
  return getUserTweetsHandler(req, params.userId);
}
