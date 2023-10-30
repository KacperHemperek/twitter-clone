import React from 'react';

import { getTweetDetails } from '@/services/Tweets.service';

import TweetComments from '@/components/tweet-details/TweetComments';
import TweetDetails from '@/components/tweet-details/TweetDetails';

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
        initialTweetDetails={tweetDetails}
      />
      <TweetComments tweetId={params.tweetId} />
    </>
  );
}
