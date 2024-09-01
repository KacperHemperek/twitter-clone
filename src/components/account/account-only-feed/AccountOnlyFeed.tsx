'use client';

import { getUsersTweets } from '@/clients/account.client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { RefreshCcwIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';

import Feed from '@/components/feed/Feed';
import FeedSceleton from '@/components/feed/FeedSceleton';

import { Tweet } from '@/types/Tweet.type';
import { PaginatedResponse } from '@/types/api/pagination';

type AccountOnlyFeedProps = {
  initialFeedData: PaginatedResponse<Tweet>;
};

export const getAccountOnlyFeedQueryKey = (userId: string) => [
  'accountOnlyTweets',
  userId,
];

export default function AccountOnlyFeed() {
  const urlParams = useParams();

  const userId: string = !Array.isArray(urlParams.userId)
    ? urlParams.userId
    : urlParams.userId[0];

  const {
    data: tweets,
    fetchNextPage,
    hasNextPage,
    isError,
    refetch,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryFn: ({ pageParam }) => getUsersTweets(userId, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    queryKey: getAccountOnlyFeedQueryKey(userId),
  });

  if (isLoading) {
    return <FeedSceleton numberOfTweets={4} />;
  }

  if (isError || error) {
    return (
      <div className="text-center flex flex-col gap-4 items-center py-20 px-6">
        Something went wrong while getting users tweets
        <button
          className="px-4 py-2 rounded-full bg-sky-500 max-w-fit flex items-center"
          onClick={() => refetch()}
        >
          <RefreshCcwIcon className="w-4 h-4" />
          <span>Try again</span>
        </button>
      </div>
    );
  }

  if (!tweets?.pages.length) {
    return <div className="text-center">No tweets here</div>;
  }

  return (
    <Feed
      fetchNextPage={fetchNextPage}
      posts={tweets.pages.map((page) => page.data).flat()}
      feedQueryKey={getAccountOnlyFeedQueryKey(userId)}
      hasNextPage={hasNextPage}
      noMoreTweetsText={`This user does not have any more tweets`}
    />
  );
}
