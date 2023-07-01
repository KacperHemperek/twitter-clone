import { TweetSceleton } from './tweet/TweetSceleton';
import React from 'react';

export default function FeedSceleton({
  numberOfTweets = 15,
}: {
  numberOfTweets?: number;
}) {
  return (
    <>
      {[...Array(numberOfTweets)].map((_, idx) => (
        <TweetSceleton key={idx} />
      ))}
    </>
  );
}
