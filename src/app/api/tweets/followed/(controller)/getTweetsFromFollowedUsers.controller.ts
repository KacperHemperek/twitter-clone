import { auth } from '@/auth';

import { FollowService } from '@/server/services/follow.service';

import {
  getPageNumber,
  getServerSearchParams,
} from '@/lib/getServerSearchParams';
import { UnauthorizedError } from '@/lib/server';

import { TweetsService } from '@/server';
import { NextRequest, NextResponse } from 'next/server';

export async function getTweetsFromFollowedUsersHandler(req: NextRequest) {
  const session = await auth();

  if (!session) {
    throw new UnauthorizedError();
  }

  const { page } = getServerSearchParams<['page']>(req, ['page']);
  const pageNumber = getPageNumber(page);

  const followedUserIds = await FollowService.getUserFolloweeIds(
    session.user.id
  );

  const tweets = await TweetsService.getTweetsFromFollowedUsers({
    page: pageNumber,
    limit: 10,
    userId: session.user.id,
  });
  //const tweets = await getTweetsFromFollowedUsers(pageNumber, session.user.id);

  const nextPage = tweets.length === 10 ? pageNumber + 1 : undefined;

  return NextResponse.json({ nextPage, data: tweets });
}
