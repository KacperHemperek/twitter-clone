import MainWrapper from '@/components/layout/MainWrapper';
import TweetDetailsHeader from '@/components/tweet-details/Header';
import React from 'react';

export default function TweetDetails({
  params,
}: {
  params: { tweetId: string };
}) {
  return (
    <MainWrapper headerComponent={<TweetDetailsHeader />} showBorder={false}>
      <div>tweet id {params.tweetId}</div>
    </MainWrapper>
  );
}
