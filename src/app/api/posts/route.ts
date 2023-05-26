import { NextRequest } from 'next/server';

import { getPostsController } from './(controllers)/getPosts.controller';
import { createPostController } from './(controllers)/createPost.controller';

export async function GET(req: NextRequest) {
  return getPostsController(req);
}

export async function POST(req: NextRequest) {
  return createPostController(req);
}
