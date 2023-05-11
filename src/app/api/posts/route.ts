import { prisma } from '@/db/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const posts = await prisma.post.findMany({
    select: {
      author: true,
      createdAt: true,
      id: true,
      message: true,
      likes: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ data: posts });
}
