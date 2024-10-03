import { AccountParams } from '@/app/api/user/[userId]/tweets/route';
import { auth } from '@/auth';

import { FollowService } from '@/server/services/follow.service';

import '@/lib/server';
import { ServerError } from '@/lib/server';

import { NextRequest, NextResponse } from 'next/server';

export async function follwoUserHandler(_: NextRequest, params: AccountParams) {
  const { userId } = params;

  const session = await auth();

  if (!session) {
    throw new ServerError({ code: 403, message: 'User is not authenticated' });
  }

  const followersIds = await FollowService.getUserFollowerIds(userId);

  if (followersIds.includes(session.user.id)) {
    await FollowService.unfollowUser({
      followerId: session.user.id,
      followeeId: userId,
    });

    return NextResponse.json({ message: 'User unfollowed successfully' });
  }

  await FollowService.followUser({
    followeeId: userId,
    followerId: session.user.id,
  });

  return NextResponse.json({ message: 'User followed successfully' });
}
