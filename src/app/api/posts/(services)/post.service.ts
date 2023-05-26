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
