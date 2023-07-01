import { Post } from '@/types/Post.type';
import { PaginatedResponse } from '@/types/api/pagination';

export async function addComment(tweetBody: string, tweetId?: string) {
  await fetch(`/api/tweets/${tweetId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ tweetBody }),
  });
}

export async function getComments(
  pageParam: number,
  tweetId: string
): Promise<PaginatedResponse<Post>> {
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
