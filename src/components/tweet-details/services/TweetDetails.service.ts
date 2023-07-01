import { Post } from '@/types/Post.type';

export async function getTweetDetails(
  tweetId: string
): Promise<Post | undefined> {
  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/tweets/${tweetId}`;

  const tweetDetailsRes = await fetch(url, { cache: 'no-cache' });

  const tweetDetails = await tweetDetailsRes.json();

  return tweetDetails;
}
