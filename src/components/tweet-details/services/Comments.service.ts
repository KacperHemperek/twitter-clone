import { Tweet } from '@/types/Tweet.type';
import { PaginatedResponse } from '@/types/api/pagination';

export async function addComment(tweetBody: string, tweetId?: string) {
  const res = await fetch(`/api/tweets/${tweetId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ tweetBody }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error?.message ?? 'Something went wrong while adding your comment'
    );
  }
}

export async function getComments(
  pageParam: number,
  tweetId: string
): Promise<PaginatedResponse<Tweet>> {
  const url = `/api/tweets/${tweetId}/comments?page=${pageParam}`;

  const res = await fetch(url);

  if (!res.ok)
    throw new Error(
      `Error occured while fetching comments for tweet with id: ${tweetId}`,
      {
        cause: res.statusText,
      }
    );
  return await res.json();
}
