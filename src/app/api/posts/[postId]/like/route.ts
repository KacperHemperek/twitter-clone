import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/db/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: { postId: string };
  }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return NextResponse.json(
      {},
      {
        status: 403,
        statusText: 'User must be logged in to perform that action',
      }
    );
  }

  const userLikedThatPost = await prisma.like.findFirst({
    where: { postId: params.postId, AND: { userId: session.user.id } },
    select: { id: true },
  });

  if (!!userLikedThatPost) {
    await prisma.like.delete({ where: { id: userLikedThatPost.id } });
  } else {
    await prisma.like.create({
      data: { userId: session.user.id, postId: params.postId },
    });
  }

  return NextResponse.json({
    message: !!userLikedThatPost ? 'disliked successfuly' : 'liked successfuly',
  });
}
