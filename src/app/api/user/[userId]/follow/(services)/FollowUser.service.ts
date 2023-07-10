import { ServerError } from '@/lib/serverError';

import { prisma } from '@/db/prisma';

export async function followUser(userId: string, userToFollowId: string) {
  try {
    await prisma.user.update({
      where: { id: userToFollowId },
      data: { followers: { connect: [{ id: userId }] } },
    });
  } catch (error: any) {
    throw new ServerError({
      code: 500,
      message: `Cound't follow user with id: ${userToFollowId}`,
    });
  }
}

export async function unfollowUser(userId: string, userToUnfollowId: string) {
  try {
    await prisma.user.update({
      where: { id: userToUnfollowId },
      data: { followers: { disconnect: [{ id: userId }] } },
    });
  } catch (error: any) {
    throw new ServerError({
      code: 500,
      message: `Cound't unfollow user with id: ${userToUnfollowId}`,
    });
  }
}

export async function getUserFollowersIds(userId: string): Promise<string[]> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { followers: { select: { id: true } } },
    });

    if (!user) {
      throw new ServerError({
        code: 404,
        message: `User with id: ${userId} not found`,
      });
    }

    return user.followers.map((follower) => follower.id);
  } catch (err: any) {
    throw new ServerError({
      code: 500,
      message: `Couldn't get user followers`,
    });
  }
}
