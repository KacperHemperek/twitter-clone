import React from 'react';

import { cn } from '@/lib/cn';
import { formatTweetDate } from '@/lib/dateFormatters';

export default function TweetUserInfo({
  authorName,
  authorEmail,
  createdAt,
  showDate = true,
  alwaysShowShowInColumn = false,
}: {
  authorName?: string | null;
  authorEmail?: string | null;
  createdAt?: Date | null;
  showDate?: boolean;
  alwaysShowShowInColumn?: boolean;
}) {
  return (
    <div
      className={cn(
        !alwaysShowShowInColumn && 'xl:flex-row xl:gap-1',
        'flex flex-col gap-0.5 '
      )}
    >
      <h5 className="whitespace-nowrap font-bold">{authorName} </h5>
      <div className="flex gap-0.5 xl:gap-1">
        <span className="truncate text-gray-400">{`@${
          authorEmail ?? ''
        }`}</span>
        {showDate && createdAt && (
          <>
            <span className="text-gray-400">·</span>
            <span className=" text-gray-400">
              {formatTweetDate(new Date(createdAt))}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
