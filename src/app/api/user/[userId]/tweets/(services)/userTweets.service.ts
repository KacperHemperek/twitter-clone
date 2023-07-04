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
      take: TWEET_LIMIT,
      skip: (page - 1) * TWEET_LIMIT,
      orderBy: { createdAt: 'desc' },
    });

    const postsWithRetweetedByPromises = posts.map(async (post) => {
      const retweetedById = post.retweets.find(
        (retweet) => retweet.userId === userId
      )?.userId;

      if (!retweetedById) {
        return post;
      }

      const retweetedBy = await prisma.user.findUnique({
        where: { id: retweetedById },
        select: { name: true },
      });

      if (retweetedBy) {
        console.dir({
          ...post,
          retweetedBy: retweetedBy.name ?? undefined,
        });
      }
      return { ...post, retweetedBy: undefined };
    });

    const postsWithRetweetedBy = await Promise.all(
      postsWithRetweetedByPromises
    );

    return postsWithRetweetedBy;
  } catch (e) {
    throw new ServerError(500, 'There was a problem retrieving feed data');
  }
}
