import React from 'react';

import { TweetSceleton } from '@/components/feed/tweet/TweetSceleton';
import TweetDetailsSceleton from '@/components/tweet-details/TweetDetailsSceleton';

export default function LoadingTweetDetails() {
  return (
    <>
      <TweetDetailsSceleton />

      {[...Array(5)].map((_, index) => (
        <TweetSceleton key={index} />
      ))}
    </>
  );
}
