import { Post } from '@/types/Post.type';
import { PaginatedResponse } from '@/types/api/pagination';

export async function getMainFeedTweets(
  page?: number
): Promise<PaginatedResponse<Post>> {
  const url = `${process.env.NEXTAUTH_URL}/api/tweets${
    page ? '?page=' + page : ''
  }`;

  const res = await fetch(url, { cache: 'no-cache' });

  if (!res.ok) {
    throw new Error('Error occured while fetching tweets', {
      cause: res.statusText,
    });
  }

  const tweets = await res.json();

  return tweets;
}
