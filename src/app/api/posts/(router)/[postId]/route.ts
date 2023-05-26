import { NextRequest } from 'next/server';

import { getTweetDetailsController } from './(controllers)/getTweetDetails';

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
