import React, { PropsWithChildren } from 'react';

import MainWrapper from '@/components/layout/MainWrapper';
import TweetDetailsHeader from '@/components/tweet-details/TweetDetailsHeader';

export default function TweetDetailsLayout({ children }: PropsWithChildren) {
  return (
    <MainWrapper headerComponent={<TweetDetailsHeader />} showBorder={false}>
      <div className="flex flex-col text-sm">{children}</div>
    </MainWrapper>
  );
}
