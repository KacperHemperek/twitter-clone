'use client';
import React from 'react';
import Tweet from './Tweet';
import { type Post as PostType } from '@/types/Post.type';

export default function Feed({ initialPosts }: { initialPosts: PostType[] }) {
  return (
    <>
      {initialPosts.map((post) => (
        <Tweet key={post.id} post={post} />
      ))}
    </>
  );
}
