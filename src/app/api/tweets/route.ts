import { NextRequest } from 'next/server';

import { createPostController } from './(controllers)/createPost.controller';
import { getPostsController } from './(controllers)/getPosts.controller';

import { apiHandler } from '@/lib/serverError';

export async function GET(req: NextRequest) {
  return apiHandler(getPostsController, req);
}

export async function POST(req: NextRequest) {
  return apiHandler(createPostController, req);
}
