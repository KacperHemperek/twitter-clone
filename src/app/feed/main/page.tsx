import Feed from '@/components/feed/Feed';
import { GetPostsType } from '@/types/api/posts';
import React from 'react';
import MainFeed from './MainFeed';

export default async function page() {
  const posts: GetPostsType = await fetch(
    process.env.NEXTAUTH_URL! + '/api/posts'
  ).then((res) => res.json());

  return <MainFeed initialData={posts} />;
}
