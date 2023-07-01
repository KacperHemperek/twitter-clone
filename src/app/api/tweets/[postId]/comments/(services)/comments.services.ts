import { ServerError } from '@/lib/serverError';

import { Post } from '@/types/Post.type';

import { prisma } from '@/db/prisma';

const LIMIT_COMMENT_AMMOUNT = 10;

export async function getComments(
  tweetId: string,
  page: number
): Promise<Post[]> {
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
      take: LIMIT_COMMENT_AMMOUNT,
      skip: (page - 1) * LIMIT_COMMENT_AMMOUNT,
      orderBy: { createdAt: 'desc' },
    });

    return comments;
  } catch (e) {
    throw new ServerError(500, "Couldn't retrieve comments for tweet ");
  }
}

export async function createComment({
  authorId,
  message,
  parentId,
}: {
  parentId: string;
  message: string;
  authorId: string;
}) {
  try {
    const newComment = await prisma.post.create({
      data: {
        message,
        authorId,
        parentId,
      },
    });

    return newComment;
  } catch (e) {
    throw new ServerError(500, "Couldn't add comment");
  }
}
