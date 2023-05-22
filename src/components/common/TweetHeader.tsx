import { formatTweetDate } from '@/lib/timeAgo';
import React from 'react';

export default function TweetUserInfo({
  authorName,
  authorEmail,
  createdAt,
  showDate = true,
}: {
  authorName?: string | null;
  authorEmail?: string | null;
  createdAt?: string | null;
  showDate?: boolean;
}) {
  return (
    <div className='flex flex-col gap-0.5 xl:flex-row xl:gap-1'>
      <h5 className='whitespace-nowrap font-bold'>{authorName} </h5>
      <div className='flex gap-0.5 xl:gap-1'>
        <span className='truncate text-gray-400'>{`@${
          authorEmail ?? ''
        }`}</span>
        {showDate && createdAt && (
          <>
            <span className='text-gray-400'>·</span>
            <span className=' text-gray-400'>
              {formatTweetDate(new Date(createdAt))}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
