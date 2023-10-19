import { NextRequest } from 'next/server';

import { getSearchTweetsController } from '@/app/api/search/tweets/(controllers)/searchTweets.controller';

import { apiHandler } from '@/lib/server';

export function GET(req: NextRequest) {
  return apiHandler(getSearchTweetsController, req);
}
