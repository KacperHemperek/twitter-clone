import { ServerError } from '@/lib/serverError';

import { prisma } from '@/db/prisma';

export async function getLikeByTweetIdAndUserId(
  tweetId: string,
  userId: string
) {
  try {
    const like = await prisma.like.findFirst({
      where: { postId: tweetId, AND: { userId: userId } },
      select: { id: true },
    });

    return like;
  } catch (e) {
    throw new ServerError(500, "Couldn't like tweet");
  }
}

export async function likeTweet(userId: string, tweetId: string) {
  try {
    await prisma.like.create({
      data: { userId: userId, postId: tweetId },
    });
  } catch (_) {
    throw new ServerError(500, "Couldn't like tweet");
  }
}

export async function dislikeTweet(likeId: string) {
  try {
    await prisma.like.delete({ where: { id: likeId } });
  } catch (_) {
    throw new ServerError(500, "Couldn't dislike tweet");
  }
}
