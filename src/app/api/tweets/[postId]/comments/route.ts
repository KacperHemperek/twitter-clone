import { type NextRequest } from 'next/server';

import { addCommentHandler } from './(controllers)/addComment.controller';
import { getCommentsHandler } from './(controllers)/getComments.controller';

import { apiHandler } from '@/lib/server';

export type CommentsParams = {
  postId: string;
};

export async function GET(
  req: NextRequest,
  params: { params: CommentsParams }
) {
  return apiHandler(getCommentsHandler, req, params);
}

export async function POST(
  req: NextRequest,
  params: { params: CommentsParams }
) {
  return apiHandler(addCommentHandler, req, params);
}
