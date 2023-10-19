import { ServerError } from '@/lib/server';

import { prisma } from '@/db/prisma';

const FEED_LIMIT = 10;

export async function getTweetsFromFollowedUsers(page: number, userId: string) {
  try {
    const tweets = await prisma.post.findMany({
      where: {
        author: {
          followers: { some: { id: userId } },
        },
        AND: {
          parentId: null,
        },
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
      take: FEED_LIMIT,
      skip: (page - 1) * FEED_LIMIT,
      orderBy: { createdAt: 'desc' },
    });
    return tweets;
  } catch (err: any) {
    throw new ServerError({
      code: 500,
      message: 'There was a problem retrieving feed data',
    });
  }
}
