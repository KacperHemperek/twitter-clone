import React from 'react';

import { cn } from '@/lib/cn';
import { formatTweetDate } from '@/lib/dateFormatters';

export default function TweetUserInfo({
  authorName,
  authorEmail,
  createdAt,
  showDate = true,
  alwaysShowShowInColumn = false,
  className,
}: {
  authorName?: string | null;
  authorEmail?: string | null;
  createdAt?: Date | null;
  showDate?: boolean;
  alwaysShowShowInColumn?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-0.5 text-sm',
        !alwaysShowShowInColumn && 'xl:flex-row xl:gap-1',
        className
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
