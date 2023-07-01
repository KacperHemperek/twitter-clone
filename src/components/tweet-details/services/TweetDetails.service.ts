import { Post } from '@/types/Post.type';

export async function getTweetDetails(
  tweetId: string
): Promise<Post | undefined> {
  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/tweets/${tweetId}`;

  const res = await fetch(url, { cache: 'no-cache' });

  if (!res.ok)
    throw new Error('Error occured while fetching tweet details', {
      cause: res.statusText,
    });

  const tweetDetails = await res.json();

  return tweetDetails;
}
