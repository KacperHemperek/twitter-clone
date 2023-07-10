import { AccountParams } from '@/app/api/user/[userId]/tweets/route';
import { authOptions } from '@/utils/next-auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import {
  followUser,
  getUserFollowersIds,
  unfollowUser,
} from '@/app/api/user/[userId]/follow/(services)/FollowUser.service';

import '@/lib/serverError';
import { ServerError } from '@/lib/serverError';

export async function follwoUserHandler(
  req: NextRequest,
  params: AccountParams
) {
  const { userId } = params;

  const session = await getServerSession(authOptions);

  if (!session) {
    throw new ServerError({ code: 403, message: 'User is not authenticated' });
  }

  const followersIds = await getUserFollowersIds(userId);

  if (followersIds.includes(session.user.id)) {
    await unfollowUser(session.user.id, userId);

    return NextResponse.json({ message: 'User unfollowed successfully' });
  }

  await followUser(session.user.id, userId);

  return NextResponse.json({ message: 'User followed successfully' });
}
