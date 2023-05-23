import MainWrapper from '@/components/layout/MainWrapper';
import TweetDetailsHeader from '@/components/tweet-details/TweetDetailsHeader';
import React, { PropsWithChildren } from 'react';

export default function TweetDetailsLayout({ children }: PropsWithChildren) {
  return (
    <MainWrapper headerComponent={<TweetDetailsHeader />} showBorder={false}>
      <div className='flex flex-col p-4 text-sm'>{children}</div>
    </MainWrapper>
  );
}
