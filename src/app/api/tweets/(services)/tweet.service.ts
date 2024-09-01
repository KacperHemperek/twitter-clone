import { ServerError } from '@/lib/server';

import { prisma } from '@/db/prisma';

export async function getTweetDetails(tweetId: string) {
  try {
    const tweetDetails = await prisma.post.findUnique({
      where: { id: tweetId },
      select: {
        author: true,
        id: true,
        likes: { select: { id: true, userId: true } },
        message: true,
        createdAt: true,
        comments: { select: { id: true } },
        retweets: { select: { id: true, userId: true } },
      },
    });

    return tweetDetails;
  } catch (e) {
    throw new ServerError({
      code: 404,
      message: "Couldn't find tweet with given id",
    });
  }
}

export async function updateTweet(tweetId: string, message: string) {
  try {
    const updatedTweet = await prisma.post.update({
      where: { id: tweetId },
      data: { message },
    });

    return updatedTweet;
  } catch (e) {
    throw new ServerError({
      code: 500,
      message: "Couldn't update tweet with given id",
    });
  }
}
