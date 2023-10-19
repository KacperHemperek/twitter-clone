import { ServerError } from '@/lib/server';

import { prisma } from '@/db/prisma';

const TWEET_LIMIT = 10;

export async function getLikedTweets(userId: string, page: number) {
  try {
    const tweets = await prisma.post.findMany({
      where: {
        likes: { some: { userId } },
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
      take: TWEET_LIMIT,
      skip: (page - 1) * TWEET_LIMIT,
      orderBy: { createdAt: 'desc' },
    });

    return tweets;
  } catch (e) {
    throw new ServerError({
      code: 500,
      message: 'There was a problem retrieving feed data',
    });
  }
}
