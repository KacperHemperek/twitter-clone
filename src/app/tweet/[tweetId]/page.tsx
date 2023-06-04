import React from 'react';

import { getTweetDetails } from '@/components/tweet-details/services/TweetDetails.service';

import TweetComments from '@/components/tweet-details/components/TweetComments';
import TweetDetails from '@/components/tweet-details/components/TweetDetails';

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
