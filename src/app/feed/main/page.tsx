import React from 'react';
import MainFeed from './MainFeed';
import { Post } from '@/types/Post.type';
import { PaginatedResponse } from '@/types/api/pagination';

export default async function page() {
  const posts: PaginatedResponse<Post> = await fetch(
    process.env.NEXTAUTH_URL! + '/api/posts',
    { cache: 'no-cache' }
  ).then((res) => res.json());

  return (
    <>
      <MainFeed initialData={posts} />
    </>
  );
}
