import { TweetSceleton } from './TweetSceleton';
import React from 'react';

export default function FeedLoading() {
  return (
    <>
      {[...Array(15)].map((_, idx) => (
        <TweetSceleton key={idx} />
      ))}
    </>
  );
}
