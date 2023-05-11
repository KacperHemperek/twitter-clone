'use client';
import React from 'react';
import Post from './Post';
import { type Post as PostType } from '@/types/Post.type';

export default function Feed({ initialPosts }: { initialPosts: PostType[] }) {
  return (
    <>
      {initialPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}
