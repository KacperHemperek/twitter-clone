import { ServerError } from '@/lib/server';

import { prisma } from '@/db/prisma';

const LIMIT = 10;

export async function searchTweets(searchQ: string, page: number) {
  try {
    const results = await prisma.post.findMany({
      where: { message: { search: searchQ } },
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
      take: LIMIT,
      skip: (page - 1) * LIMIT,
      orderBy: { createdAt: 'desc' },
    });

    return results;
  } catch (e) {
    throw new ServerError({ code: 500, message: "Couldn't search tweets" });
  }
}
