import React from 'react';

import { InfiniteQueryData } from '@/lib/infiniteQueryHelpers';

import { Post } from '@/types/Post.type';

export default function CommentsFeed({
  initialData,
}: {
  initialData: InfiniteQueryData<Post>;
}) {
  return <div>Comments feed</div>;
}
