import { prisma } from '@/db/prisma';
import { Post } from '@/types/Post.type';
import { NextRequest, NextResponse } from 'next/server';
import { getTweetDetailsController } from '../(controllers)/getTweetDetails';

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { postId: string };
  }
) {
  return getTweetDetailsController(params.postId);
}
