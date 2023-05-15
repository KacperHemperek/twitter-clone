import { prisma } from '@/db/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

const LIMIT = 10;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = !!Number(searchParams.get('page'))
    ? Number(searchParams.get('page'))
    : 1;

  console.log('page ', page);

  const posts = await prisma.post.findMany({
    select: {
      author: true,
      createdAt: true,
      id: true,
      message: true,
      likes: true,
    },
    take: LIMIT,
    skip: (page - 1) * LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  const nextPage = posts.length === 10 ? page + 1 : undefined;

  return NextResponse.json({ data: posts, nextPage });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(undefined, {
        status: 403,
        statusText: 'User is not authenticated',
      });
    }

    const body: { tweetBody?: string } = await req.json();

    if (!body.tweetBody) {
      return NextResponse.json(undefined, {
        status: 400,
        statusText: 'Tweet body must not be empty',
      });
    }

    const newPost = await prisma.post.create({
      data: { message: body.tweetBody, authorId: session.user.id },
    });

    return NextResponse.json({ data: { createdPost: newPost } });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      {
        status: 500,
        statusText: 'Internal server error',
      }
    );
  }
}
