'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';

import { createTweet, getMainFeedTweets } from '@/services/Tweets.service';

import NewTweetForm from '@/components/common/new-tweet-form/NewTweetForm';
import Feed from '@/components/feed/Feed';

import { Tweet } from '@/types/Tweet.type';
import { PaginatedResponse } from '@/types/api/pagination';

export const MAIN_FEED_QUERY_KEYS = ['mainTweets'];

export default function MainFeed({
  initialData,
}: {
  initialData: PaginatedResponse<Tweet>;
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
    getNextPageParam: (lastPage) => lastPage.nextPage,
    refetchOnMount: false,
  });
  const arrayOfReducedTweets = useMemo<Tweet[]>(() => {
    return (
      tweets?.pages
        .map((page) => page.data)
        .reduce(
          (allTweets, currentTweets) => [...allTweets, ...currentTweets],
          []
        ) ?? []
    );
  }, [tweets]);

  if (!tweets?.pages.length) {
    return <div>No tweets here</div>;
  }

  return (
    <>
      <NewTweetForm
        feedQueryKey={MAIN_FEED_QUERY_KEYS}
        createTweet={createTweet}
      />
      <Feed
        posts={arrayOfReducedTweets}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        feedQueryKey={MAIN_FEED_QUERY_KEYS}
      />
    </>
  );
}
