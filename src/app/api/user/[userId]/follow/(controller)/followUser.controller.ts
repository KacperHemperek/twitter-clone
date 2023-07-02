import { authOptions } from '@/utils/next-auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import {
  followUser,
  getUserFollowersIds,
  unfollowUser,
} from '@/app/api/user/[userId]/follow/(services)/FollowUser.service';

import { handleServerError, nextServerErrorFactory } from '@/lib/serverError';

export async function follwoUserHandler(req: NextRequest, userId: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return nextServerErrorFactory(403, 'User is not authenticated');
  }

  try {
    const followersIds = await getUserFollowersIds(userId);

    if (followersIds.includes(session.user.id)) {
      await unfollowUser(session.user.id, userId);

      return NextResponse.json({ message: 'User unfollowed successfully' });
    }

    await followUser(session.user.id, userId);

    return NextResponse.json({ message: 'User followed successfully' });
  } catch (err) {
    return handleServerError(err);
  }
}
