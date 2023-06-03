import React from 'react';

import TweetComments from '@/components/tweet-details/components/TweetComments';
import TweetDetails from '@/components/tweet-details/components/TweetDetails';

import { Post } from '@/types/Post.type';

export async function getTweetDetails(
  tweetId: string
): Promise<Post | undefined> {
  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/tweets/${tweetId}`;

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
      <TweetComments tweetId={params.tweetId} />
    </>
  );
}
