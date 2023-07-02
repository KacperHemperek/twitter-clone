import React from 'react';

import AccountDetailsSceleton from '@/components/account/account-details/AccountDetailsSceleton';
import FeedSceleton from '@/components/feed/FeedSceleton';

export default function LoadingAccountDetails() {
  return (
    <>
      <AccountDetailsSceleton />
      <FeedSceleton numberOfTweets={5} />
    </>
  );
}
