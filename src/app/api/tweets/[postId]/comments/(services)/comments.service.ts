import { ServerError } from '@/lib/server';

import { Tweet } from '@/types/Tweet.type';

import { prisma } from '@/db/prisma';

const LIMIT_COMMENT_AMMOUNT = 10;

export async function getComments(tweetId: string, page: number) {
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
        retweets: { select: { id: true, userId: true, postId: true } },
      },
      take: LIMIT_COMMENT_AMMOUNT,
      skip: (page - 1) * LIMIT_COMMENT_AMMOUNT,
      orderBy: { createdAt: 'desc' },
    });

    return comments;
  } catch (e) {
    throw new ServerError({
      code: 500,
      message: "Couldn't retrieve comments for tweet ",
    });
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
    throw new ServerError({ code: 500, message: "Couldn't add comment" });
  }
}
