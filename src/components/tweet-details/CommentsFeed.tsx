import { InfiniteQueryData } from '@/lib/infiniteQueryHelpers';
import { Post } from '@/types/Post.type';
import React from 'react';

export default function CommentsFeed({
  initialData,
}: {
  initialData: InfiniteQueryData<Post>;
}) {
  return <div>Comments feed</div>;
}
