'use client';

import Tweet from './tweet/Tweet';
import React, { useEffect, useRef } from 'react';

import { type Tweet as PostType } from '@/types/Tweet.type';

export default function Feed({
  posts,
  fetchNextPage,
  hasNextPage,
  feedQueryKey,
  noMoreTweetsText = 'No more tweets',
}: {
  posts: PostType[];
  fetchNextPage: () => void;
  feedQueryKey: string[];
  hasNextPage?: boolean;
  noMoreTweetsText?: string;
}) {
  const lastItemRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) observer.current = null;

    if (lastItemRef.current) {
      observer.current = new IntersectionObserver(
        (entries) => entries[0].isIntersecting && hasNextPage && fetchNextPage()
      );

      observer.current.observe(lastItemRef.current);
    }

    return () => {
      observer.current &&
        lastItemRef.current &&
        observer.current.unobserve(lastItemRef.current);
    };
  }, [fetchNextPage, hasNextPage, lastItemRef, observer]);

  return (
    <>
      {posts.map((post, idx) => (
        <Tweet key={post.id + idx} post={post} feedQueryKey={feedQueryKey} />
      ))}
      {hasNextPage && (
        <div className="p-3 text-center" ref={lastItemRef}>
          Loading more tweets...
        </div>
      )}{' '}
      {!hasNextPage && (
        <div className="p-3 text-center">{noMoreTweetsText}</div>
      )}
    </>
  );
}
