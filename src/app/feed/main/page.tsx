import MainFeed from '@/app/feed/main/(components)/MainFeed';
import React from 'react';

import { getMainFeedTweets } from '@/components/feed/Feed.service';

export default async function MainFeedPage() {
  const posts = await getMainFeedTweets();

  return (
    <>
      <MainFeed initialData={posts} />
    </>
  );
}
