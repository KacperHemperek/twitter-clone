'use client';
import React from 'react';
import Post from './Post';

export default function Feed({ posts }: { posts: any[] }) {
  return (
    <>
      {[...posts, ...posts, ...posts, ...posts, ...posts].map((post) => (
        <Post post={post} />
      ))}
    </>
  );
}
