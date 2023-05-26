'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';

import Feed from '@/components/feed/Feed';

import { Post } from '@/types/Post.type';
import { PaginatedResponse } from '@/types/api/pagination';

async function getComments(
  pageParam: number,
  tweetId: string
): Promise<PaginatedResponse<Post>> {
  const url = `/api/tweets/${tweetId}/comments`;

  const res = await fetch(url);
  const comments = await res.json();

  return comments;
}

export default function TweetComments({ tweetId }: { tweetId: string }) {
  const { data: comments, fetchNextPage } = useInfiniteQuery({
    queryKey: ['comments', tweetId],
    queryFn: async ({ pageParam }) => getComments(pageParam, tweetId),
  });

  const arrayOfReducedTweets = useMemo<Post[]>(() => {
    return (
      comments?.pages
        .map((page) => page.data)
        .reduce(
          (allTweets, currentTweets) => [...allTweets, ...currentTweets],
          []
        ) ?? []
    );
  }, [comments]);

  return (
    <Feed
      feedQueryKey={['comments', tweetId]}
      fetchNextPage={fetchNextPage}
      posts={arrayOfReducedTweets}
    />
  );
}
