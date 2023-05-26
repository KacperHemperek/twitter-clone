import { prisma } from '@/db/prisma';
import { ServerError, nextServerErrorFactory } from '@/lib/serverError';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function getLikeByTweetIdAndUserId(tweetId: string, userId: string) {
  try {
    const like = await prisma.like.findFirst({
      where: { postId: tweetId, AND: { userId: userId } },
      select: { id: true },
    });

    return like;
  } catch (e) {
    throw new ServerError(500, "Couldn't like tweet");
  }
}

async function likeTweet(userId: string, tweetId: string) {
  try {
    await prisma.like.create({
      data: { userId: userId, postId: tweetId },
    });
  } catch (_) {
    throw new ServerError(500, "Couldn't like tweet");
  }
}

async function dislikeTweet(likeId: string) {
  try {
    await prisma.like.delete({ where: { id: likeId } });
  } catch (_) {
    throw new ServerError(500, "Couldn't dislike tweet");
  }
}

export async function likeTweetController(tweetId: string) {
  try {
    const session = await getServerSession(authOptions);

    const userId = session?.user.id;

    if (!userId) {
      return nextServerErrorFactory(
        403,
        'User must be logged in to perform that action'
      );
    }

    const like = await getLikeByTweetIdAndUserId(tweetId, userId);

    if (!!like) {
      await dislikeTweet(like.id);
    } else {
      await likeTweet(userId, tweetId);
    }

    return NextResponse.json({
      message: !!like ? 'disliked successfuly' : 'liked successfuly',
    });
  } catch (e) {
    if (e instanceof ServerError) {
      console.log({ message: e.message, code: e.code });
      return nextServerErrorFactory(e.code, e.message);
    }

    return nextServerErrorFactory(500);
  }
}
