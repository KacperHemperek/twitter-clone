'use client';

import Feed from '@/components/feed/Feed';
import { Post } from '@/types/Post.type';
import { GetPostsType } from '@/types/api/posts';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';

async function getMainFeedTweets(page?: number) {
  const url = `/api/posts${page ? '?page=' + page : ''}`;

  return fetch(url).then((res) => res.json());
}

export default function MainFeed({
  initialData,
}: {
  initialData: GetPostsType;
}) {
  const {
    data: tweets,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<GetPostsType>({
    initialData: {
      pages: [{ data: initialData.data, nextPage: initialData.nextPage }],
      pageParams: [],
    },
    queryKey: ['mainTweets'],
    queryFn: ({ pageParam }) => {
      return getMainFeedTweets(pageParam);
    },
    getNextPageParam: (lastPage: GetPostsType) => lastPage.nextPage,
  });

  if (!tweets?.pages.length) {
    return <div>No tweets here</div>;
  }

  const arrayOfReducedTweets = useMemo<Post[]>(() => {
    return tweets.pages
      .map((page) => page.data)
      .reduce(
        (allTweets, currentTweets) => [...allTweets, ...currentTweets],
        []
      );
  }, [tweets]);

  console.log('has next page ', hasNextPage);
  return (
    <Feed
      posts={arrayOfReducedTweets}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
    />
  );
}
