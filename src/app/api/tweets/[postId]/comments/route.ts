import { type NextRequest } from 'next/server';

import { addCommentHandler } from './(controllers)/addComment.controller';
import { getCommentsHandler } from './(controllers)/getComments.controller';

export type CommentsParams = {
  postId: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: CommentsParams }
) {
  return getCommentsHandler(req, params.postId);
}

export async function POST(
  req: NextRequest,
  { params }: { params: CommentsParams }
) {
  return addCommentHandler(req, params.postId);
}
