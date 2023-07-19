'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React from 'react';

import Feed from '@/components/feed/Feed';
import FeedSceleton from '@/components/feed/FeedSceleton';

import { Tweet } from '@/types/Tweet.type';
import { ErrorResponse } from '@/types/api/error';
import { PaginatedResponse } from '@/types/api/pagination';

const searchTweets = async (searchParams: {
  page: string;
  q: string;
}): Promise<PaginatedResponse<Tweet>> => {
  const page = searchParams.page ? searchParams.page : '1';
  const q = searchParams.q;

  const params = new URLSearchParams({ page, q });

  console.log({ url: `/api/search/tweets?${params.toString()}` });

  const searchUrl = new URL(
    `http://localhost:3000/api/search/tweets?${params.toString()}`
  );

  const res = await fetch(searchUrl);

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;

    throw new Error(error.message, {
      cause: {
        status: res.status,
        cause: error.cause,
      },
    });
  }

  return await res.json();
};

const getSearchTweetsQueryKey = (searchQ: string) => ['searchTweets', searchQ];

export default function SearchTweetsFeed() {
  const params = useSearchParams();
  const searchQ = params.get('q');

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: getSearchTweetsQueryKey(searchQ!),
    queryFn: ({ pageParam }) => searchTweets({ page: pageParam, q: searchQ! }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!searchQ,
  });

  if (isLoading) {
    return <FeedSceleton numberOfTweets={4} />;
  }

  if (!searchQ) {
    return <div className="text-center py-3">Search for something</div>;
  }

  return (
    <Feed
      feedQueryKey={getSearchTweetsQueryKey(searchQ)}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      noMoreTweetsText="No more tweets found"
      posts={data?.pages.map((page) => page.data).flat() ?? []}
    />
  );
}
