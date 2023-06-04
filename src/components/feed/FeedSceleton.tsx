import { TweetSceleton } from './tweet/TweetSceleton';
import React from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function FeedLoading() {
  return (
    <>
      {[...Array(15)].map((_, idx) => (
        <TweetSceleton key={idx} />
      ))}
    </>
  );
}
