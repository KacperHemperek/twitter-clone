import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TweetSceleton } from './Tweet/TweetSceleton';

export default function FeedLoading() {
  return (
    <>
      {[...Array(15)].map((_, idx) => (
        <TweetSceleton key={idx} />
      ))}
    </>
  );
}
