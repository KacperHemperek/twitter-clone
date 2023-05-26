import { Post } from '@/types/Post.type';
import React from 'react';

import TweetDetails from '@/components/tweet-details/TweetDetails';

export async function getTweetDetails(
  tweetId: string
): Promise<Post | undefined> {
  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/posts/${tweetId}`;

  const tweetDetailsRes = await fetch(url, { cache: 'no-cache' });

  const tweetDetails = await tweetDetailsRes.json();

  return tweetDetails;
}

export default async function TweetDetailsPage({
  params,
}: {
  params: { tweetId: string };
}) {
  const tweetDetails = await getTweetDetails(params.tweetId);

  return (
    <>
      <TweetDetails
        tweetId={params.tweetId}
        initialtweetDetails={tweetDetails}
      />
    </>
  );
}
