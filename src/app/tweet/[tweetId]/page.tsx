import MainWrapper from '@/components/layout/MainWrapper';
import React from 'react';

export default function TweetDetails({
  params,
}: {
  params: { tweetId: string };
}) {
  return (
    <MainWrapper headerComponent={<div></div>}>
      <div>tweet id {params.tweetId}</div>;
    </MainWrapper>
  );
}
