import { ServerError } from '@/lib/serverError';

import { Post } from '@/types/Post.type';

import { prisma } from '@/db/prisma';

export async function getComments(tweetId: string): Promise<Post[]> {
  try {
    const comments = prisma.post.findMany({
      where: {
        parentId: tweetId,
      },
      select: {
        author: true,
        likes: true,
        message: true,
        createdAt: true,
        id: true,
        comments: { select: { id: true } },
      },
    });

    return comments;
  } catch (e) {
    throw new ServerError(500, "Couldn't retrieve comments for tweet ");
  }
}
