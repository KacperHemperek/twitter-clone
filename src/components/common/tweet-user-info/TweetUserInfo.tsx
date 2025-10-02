import React from 'react';

import { FollowsYouIndicator } from '../FollowsYouIndicator';

import { cn } from '@/lib/cn';
import { formatTweetDate } from '@/lib/dateFormatters';

export default function TweetUserInfo({
  authorName,
  authorEmail,
  createdAt,
  showDate = true,
  alwaysShowShowInColumn = false,
  followsYou = false,
  className,
}: {
  authorName?: string | null;
  authorEmail?: string | null;
  createdAt?: Date | null;
  showDate?: boolean;
  alwaysShowShowInColumn?: boolean;
  className?: string;
  followsYou?: boolean;
}) {
  return (
    <div
      className={cn(
        'gap-0.5 text-sm overflow-hidden',
        !alwaysShowShowInColumn && 'xl:flex-row xl:gap-1',
        className
      )}
    >
      <h5 className="font-bold truncate">{authorName}</h5>
      <div className=" gap-0.5 xl:gap-1">
        <div className="flex flex-col gap-1 md:flex-row md:items-center">
          <span className="text-gray-400 flex">
            <span className="truncate">{`@${authorEmail ?? ''}`}</span>
            {showDate && createdAt && (
              <>
                <span className="px-1">·</span>
                <span>{formatTweetDate(new Date(createdAt))}</span>
              </>
            )}
          </span>
          {followsYou && <FollowsYouIndicator />}
        </div>
      </div>
    </div>
  );
}
