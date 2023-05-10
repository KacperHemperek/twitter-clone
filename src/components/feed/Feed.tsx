'use client';
import React from 'react';
import Post from './Post';

export default function Feed({ initialPosts }: { initialPosts: any[] }) {
  return (
    <>
      {[
        ...initialPosts,
        ...initialPosts,
        ...initialPosts,
        ...initialPosts,
        ...initialPosts,
      ].map((post) => (
        <Post post={post} />
      ))}
    </>
  );
}
