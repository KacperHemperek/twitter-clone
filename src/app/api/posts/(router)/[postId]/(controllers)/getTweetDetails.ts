import { prisma } from '@/db/prisma';
import { ServerError, nextServerErrorFactory } from '@/lib/serverError';
import { Post } from '@/types/Post.type';
import { NextResponse } from 'next/server';

export async function getTweetDetailsController(tweetId: string) {
  if (!tweetId) {
    return nextServerErrorFactory(400, "Didn't find id in request");
  }

  try {
    const tweetDetails = await getTweetDetails(tweetId);

    if (!tweetDetails) {
      throw new ServerError(404, "Couldn't find tweet with given id");
    }

    return NextResponse.json(tweetDetails);
  } catch (e) {
    if (e instanceof ServerError) {
      return nextServerErrorFactory(e.code, e.message);
    }

    return nextServerErrorFactory(500);
  }
}

async function getTweetDetails(tweetId: string): Promise<Post | null> {
  try {
    const tweetDetails = await prisma.post.findUnique({
      where: { id: tweetId },
      select: {
        author: true,
        id: true,
        likes: true,
        message: true,
        createdAt: true,
      },
    });

    return tweetDetails;
  } catch (e) {
    throw new ServerError(404, "Couldn't find tweet with given id");
  }
}
