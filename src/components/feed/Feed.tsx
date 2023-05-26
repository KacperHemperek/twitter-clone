'use client';

import Tweet from './Tweet/Tweet';
import React, { useEffect, useRef } from 'react';

import { type Post as PostType } from '@/types/Post.type';

export default function Feed({
  posts: initialPosts,
  fetchNextPage,
  hasNextPage,
  feedQueryKey,
}: {
  posts: PostType[];
  fetchNextPage: () => void;
  feedQueryKey: string[];
  hasNextPage?: boolean;
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
  }, [lastItemRef.current, observer.current, hasNextPage]);

  return (
    <>
      {initialPosts.map((post) => (
        <Tweet key={post.id} post={post} feedQueryKey={feedQueryKey} />
      ))}
      {hasNextPage && (
        <div className="p-3 text-center" ref={lastItemRef}>
          Loading more posts...
        </div>
      )}{' '}
      {!hasNextPage && <div className="p-3 text-center">No more posts</div>}
    </>
  );
}
