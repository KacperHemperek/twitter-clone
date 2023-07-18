import { ServerError } from '@/lib/serverError';

import { prisma } from '@/db/prisma';

const MAIN_FEED_LIMIT = 10;

export async function getMainFeedTweets(page: number) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        parentId: null,
      },
      select: {
        author: true,
        createdAt: true,
        id: true,
        message: true,
        likes: true,
        comments: { select: { id: true } },
        retweets: { select: { id: true, userId: true } },
      },
      take: MAIN_FEED_LIMIT,
      skip: (page - 1) * MAIN_FEED_LIMIT,
      orderBy: { createdAt: 'desc' },
    });

    return posts;
  } catch (e) {
    throw new ServerError({
      code: 500,
      message: 'There was a problem retrieving feed data',
    });
  }
}

export async function createTweet(tweetBody: string, userId: string) {
  try {
    const newTweet = await prisma.post.create({
      data: { message: tweetBody, authorId: userId },
    });

    return newTweet;
  } catch (e) {
    throw new ServerError({ code: 500, message: "Couldn't create tweet" });
  }
}

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
