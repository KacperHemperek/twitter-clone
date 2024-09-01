import MainFeed from '@/app/feed/main/(components)/MainFeed';
import { getMainFeedTweets } from '@/clients/tweets.client';
import React from 'react';

export default async function MainFeedPage() {
  const posts = await getMainFeedTweets();

  return (
    <>
      <MainFeed initialData={posts} />
    </>
  );
}
