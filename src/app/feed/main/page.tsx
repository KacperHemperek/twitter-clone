import Feed from '@/components/feed/Feed';
import { Post } from '@/types/Post.type';
import React from 'react';

export default async function page() {
  const posts: { data: Post[] } = await fetch(
    process.env.NEXTAUTH_URL! + '/api/posts'
  ).then((res) => res.json());

  return <Feed initialPosts={posts.data} />;
}
