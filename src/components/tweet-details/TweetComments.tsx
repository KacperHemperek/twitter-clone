'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';

import { commentTweet, getComments } from '@/services/Tweets.service';

import Feed from '@/components/feed/Feed';
import NewTweetForm from '@/components/feed/new-tweet-form/NewTweetForm';
import { TweetSceleton } from '@/components/feed/tweet/TweetSceleton';

import { Tweet } from '@/types/Tweet.type';

export default function TweetComments({ tweetId }: { tweetId: string }) {
  const queryKey = ['comments', tweetId];

  const {
    data: comments,
    fetchNextPage,
    isLoading,
    hasNextPage,
    isError,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => getComments(pageParam, tweetId),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const arrayOfReducedTweets = useMemo<Tweet[]>(() => {
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
    <>
      <NewTweetForm
        feedQueryKey={queryKey}
        createTweet={commentTweet}
        tweetId={tweetId}
      />
      {isLoading &&
        [...Array(5)].map((_, index) => <TweetSceleton key={index} />)}
      {isError && (
        <div className="p-4 text-center text-base">
          Sorry something went wrong while getting comments
        </div>
      )}
      {comments && !isLoading && (
        <Feed
          feedQueryKey={['comments', tweetId]}
          fetchNextPage={fetchNextPage}
          posts={arrayOfReducedTweets}
          hasNextPage={hasNextPage}
          noMoreTweetsText="No more comments"
        />
      )}
    </>
  );
}
