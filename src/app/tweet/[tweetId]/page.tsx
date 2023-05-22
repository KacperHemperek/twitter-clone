import TweetUserInfo from '@/components/common/TweetHeader';
import MainWrapper from '@/components/layout/MainWrapper';
import TweetDetailsHeader from '@/components/tweet-details/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React from 'react';

export default function TweetDetails({
  params,
}: {
  params: { tweetId: string };
}) {
  return (
    <MainWrapper headerComponent={<TweetDetailsHeader />} showBorder={false}>
      <div className='flex flex-col p-4 text-sm'>
        <div className='flex gap-2'>
          <Avatar>
            <AvatarImage src={''} />
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <TweetUserInfo
            authorName={'test name'}
            authorEmail={'test email'}
            showDate={false}
          />
        </div>
      </div>
    </MainWrapper>
  );
}
