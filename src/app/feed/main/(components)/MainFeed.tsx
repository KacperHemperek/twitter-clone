'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';

import { getMainFeedTweets } from '@/services/Tweets.service';

import Feed from '@/components/feed/Feed';
import NewTweetForm from '@/components/feed/new-tweet-form/NewTweetForm';

import { Tweet } from '@/types/Tweet.type';
import { PaginatedResponse } from '@/types/api/pagination';

export const MAIN_FEED_QUERY_KEYS = ['mainTweets'];

async function postTweet(tweetBody: string) {
  const res = await fetch('/api/tweets', {
    method: 'POST',
    body: JSON.stringify({ tweetBody }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message);
  }
}

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
        createTweet={postTweet}
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
