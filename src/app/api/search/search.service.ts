import { ServerError } from '@/lib/serverError';

import { prisma } from '@/db/prisma';

export async function searchTweets(searchQ: string) {
  try {
    const results = await prisma.post.findMany({
      where: { message: { search: searchQ } },
      orderBy: { createdAt: 'desc' },
      select: {
        message: true,
        author: {
          select: {
            email: true,
            name: true,
            id: true,
            image: true,
          },
        },
        createdAt: true,
        id: true,
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
        comments: {
          select: {
            id: true,
          },
        },
        retweets: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    return results;
  } catch (e) {
    throw new ServerError({ code: 500, message: "Couldn't search tweets" });
  }
}
