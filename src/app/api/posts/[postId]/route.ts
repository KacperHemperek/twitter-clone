import { prisma } from '@/db/prisma';
import { Post } from '@/types/Post.type';
import { NextRequest, NextResponse } from 'next/server';

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
    return null;
  }
}
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { postId: string };
  }
) {
  if (!params.postId) {
    return NextResponse.json(
      {},
      { status: 400, statusText: "Didn't find id in request" }
    );
  }

  const tweetDetails = await getTweetDetails(params.postId);

  if (!tweetDetails) {
    return NextResponse.json(
      {},
      { status: 404, statusText: "Couldn't find tweet with given id" }
    );
  }

  return NextResponse.json(tweetDetails);
}
