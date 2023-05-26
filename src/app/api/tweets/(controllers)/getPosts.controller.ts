import { NextRequest, NextResponse } from 'next/server';

import { getMainFeedTweets } from '../(services)/post.service';

export async function getPostsController(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const page = !!Number(searchParams.get('page'))
    ? Number(searchParams.get('page'))
    : 1;

  const posts = await getMainFeedTweets(page);

  const nextPage = posts.length === 10 ? page + 1 : undefined;

  return NextResponse.json({ data: posts, nextPage });
}
