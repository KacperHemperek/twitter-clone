'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { AlertOctagonIcon, RefreshCcwIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

import { getUsersLikedTweets } from '@/services/Account.service';

import Feed from '@/components/feed/Feed';
import FeedSceleton from '@/components/feed/FeedSceleton';
import { toast } from '@/components/ui/use-toast';

const LIKED_USER_FEED_QUERY_KEY = ['likeUsersTweets'];

export default function UserLikesPage() {
  const params = useParams();
  const {
    data: feedData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isError,
    refetch,
    error,
  } = useInfiniteQuery({
    queryFn: ({ pageParam }) => getUsersLikedTweets(params.userId, pageParam),
    queryKey: LIKED_USER_FEED_QUERY_KEY,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (error || isError)
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description:
          (error as any)?.message ??
          `We couldn't update your profile. Please try again later.`,
      });
  }, [error, isError]);

  if (isLoading) {
    return <FeedSceleton numberOfTweets={10} />;
  }

  if (isError) {
    return (
      <div className="text-center flex flex-col items-center py-20 px-6">
        <AlertOctagonIcon className="w-20 h-20 text-rose-600 mb-4" />
        <h1 className="text-xl mb-8 max-w-[240px]">
          Something went wrong while loading tweets
        </h1>
        <button
          onClick={() => refetch()}
          className="px-4 py-1 rounded-full bg-sky-500 max-w-fit flex gap-2 items-center"
        >
          <RefreshCcwIcon className="w-4 h-4" />
          <span>Try again</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <Feed
        feedQueryKey={LIKED_USER_FEED_QUERY_KEY}
        posts={feedData?.pages.map((page) => page.data).flat() ?? []}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        noMoreTweetsText={`This user doesn't have any more liked tweets`}
      />
    </>
  );
}
