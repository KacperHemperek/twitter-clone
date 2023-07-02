import React from 'react';

import { InfiniteQueryData } from '@/lib/infiniteQueryHelpers';

import { Tweet } from '@/types/Tweet.type';

export default function CommentsFeed({
  initialData,
}: {
  initialData: InfiniteQueryData<Tweet>;
}) {
  return <div>Comments feed</div>;
}
