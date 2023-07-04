import { ServerError } from '@/lib/serverError';

import { Tweet } from '@/types/Tweet.type';

import { prisma } from '@/db/prisma';

const MAIN_FEED_LIMIT = 10;

export async function getMainFeedTweets(page: number): Promise<Tweet[]> {
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
        retweets: true,
      },
      take: MAIN_FEED_LIMIT,
      skip: (page - 1) * MAIN_FEED_LIMIT,
      orderBy: { createdAt: 'desc' },
    });

    return posts;
  } catch (e) {
    throw new ServerError(500, 'There was a problem retrieving feed data');
  }
}

export async function createTweet(tweetBody: string, userId: string) {
  try {
    const newTweet = await prisma.post.create({
      data: { message: tweetBody, authorId: userId },
    });

    return newTweet;
  } catch (e) {
    throw new ServerError(500, "Couldn't create tweet");
  }
}

export async function getTweetDetails(tweetId: string): Promise<Tweet | null> {
  try {
    const tweetDetails = await prisma.post.findUnique({
      where: { id: tweetId },
      select: {
        author: true,
        id: true,
        likes: true,
        message: true,
        createdAt: true,
        comments: { select: { id: true } },
        retweets: true,
      },
    });

    return tweetDetails;
  } catch (e) {
    throw new ServerError(404, "Couldn't find tweet with given id");
  }
}
