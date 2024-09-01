import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

import { getTweetsFromFollowedUsers } from '@/app/api/tweets/followed/(services)/tweetsFollowed.service';

import {
  getPageNumber,
  getServerSearchParams,
} from '@/lib/getServerSearchParams';
import { nextServerErrorFactory } from '@/lib/server';

export async function getTweetsFromFollowedUsersHandler(req: NextRequest) {
  const session = await auth();

  if (!session) {
    return nextServerErrorFactory(401, 'User is not logged in');
  }

  const { page } = getServerSearchParams<['page']>(req, ['page']);
  const pageNumber = getPageNumber(page);

  const tweets = await getTweetsFromFollowedUsers(pageNumber, session.user.id);

  const nextPage = tweets.length === 10 ? pageNumber + 1 : undefined;

  return NextResponse.json({ nextPage, data: tweets });
}
