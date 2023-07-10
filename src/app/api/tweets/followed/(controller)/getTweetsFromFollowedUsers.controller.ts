import { authOptions } from '@/utils/next-auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { getTweetsFromFollowedUsers } from '@/app/api/tweets/followed/(services)/tweetsFollowed.service';

import {
  getPageNumber,
  getServerSearchParams,
} from '@/lib/getServerSearchParams';
import { nextServerErrorFactory } from '@/lib/serverError';

export async function getTweetsFromFollowedUsersHandler(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return nextServerErrorFactory(401, 'User is not logged in');
  }

  const { page } = getServerSearchParams<['page']>(req, ['page']);
  const pageNumber = getPageNumber(page);

  console.log({ userId: session.user.id, pageNumber });

  const tweets = await getTweetsFromFollowedUsers(pageNumber, session.user.id);

  const nextPage = tweets.length === 10 ? pageNumber + 1 : undefined;

  return NextResponse.json({ nextPage, data: tweets });
}
