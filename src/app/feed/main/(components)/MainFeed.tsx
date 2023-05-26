'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';

import Feed from '@/components/feed/Feed';
import NewTweetForm from '@/components/feed/NewTweetForm/NewTweetForm';

import { Post } from '@/types/Post.type';
import { PaginatedResponse } from '@/types/api/pagination';

const MAIN_FEED_QUERY_KEYS = ['mainTweets'];

async function getMainFeedTweets(page?: number) {
  const url = `/api/posts${page ? '?page=' + page : ''}`;

  return fetch(url).then((res) => res.json());
}

export default function MainFeed({
  initialData,
}: {
  initialData: PaginatedResponse<Post>;
}) {
  const {
    data: tweets,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    initialData: {
      pages: [initialData],
      pageParams: [],
    },
    queryKey: MAIN_FEED_QUERY_KEYS,
    queryFn: ({ pageParam }) => {
      return getMainFeedTweets(pageParam);
    },
    getNextPageParam: (lastPage: any) => lastPage.nextPage,
    refetchOnMount: false,
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

  return (
    <>
      <NewTweetForm feedQueryKey={MAIN_FEED_QUERY_KEYS} />
      <Feed
        posts={arrayOfReducedTweets}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        feedQueryKey={MAIN_FEED_QUERY_KEYS}
      />
    </>
  );
}
