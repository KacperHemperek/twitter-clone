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
  const comments = await res.json();

  return comments;
}

export async function getTweetDetails(
  tweetId: string
): Promise<Post | undefined> {
  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/tweets/${tweetId}`;

  const tweetDetailsRes = await fetch(url, { cache: 'no-cache' });

  const tweetDetails = await tweetDetailsRes.json();

  return tweetDetails;
}
