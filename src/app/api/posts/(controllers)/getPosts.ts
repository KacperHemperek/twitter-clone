import { prisma } from '@/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

const LIMIT = 10;

export async function getPostsController(req: NextRequest) {
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
