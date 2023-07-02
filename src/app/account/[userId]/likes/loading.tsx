import React from 'react';

import FeedSceleton from '@/components/feed/FeedSceleton';

export default function LoadingUserTweetPage() {
  return <FeedSceleton numberOfTweets={5} />;
}
