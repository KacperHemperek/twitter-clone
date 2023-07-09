import { ServerError } from '@/lib/serverError';

import { prisma } from '@/db/prisma';

const TWEET_LIMIT = 10;

export async function getUsersTweets(userId: string, page: number) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            parentId: null,
            authorId: userId,
          },
          {
            retweets: { some: { userId } },
          },
        ],
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
      orderBy: { createdAt: 'desc' },
      take: TWEET_LIMIT,
      skip: (page - 1) * TWEET_LIMIT,
    });

    return posts;
  } catch (e) {
    throw new ServerError(500, 'There was a problem retrieving feed data');
  }
}
