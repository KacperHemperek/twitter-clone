import React from 'react';

import { TweetSceleton } from '@/components/feed/Tweet/TweetSceleton';
import TweetDetailsSceleton from '@/components/tweet-details/components/TweetDetailsSceleton';

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
