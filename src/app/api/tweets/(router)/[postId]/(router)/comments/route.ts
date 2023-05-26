import { type NextRequest } from 'next/server';

import { getCommentsHandler } from './(controllers)/getComments.controller';

export type GetCommentsParams = {
  postId: string;
};

export async function GET(
  req: NextRequest,
  { params }: { params: GetCommentsParams }
) {
  return getCommentsHandler(req, params.postId);
}
