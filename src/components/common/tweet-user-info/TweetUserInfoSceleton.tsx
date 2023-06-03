import React from 'react';

import { cn } from '@/lib/cn';

export default function TweetUserInfoSceleton({
  alwaysShowShowInColumn,
  showDate,
}: {
  alwaysShowShowInColumn: boolean;
  showDate: boolean;
}) {
  return (
    <div
      className={cn(
        !alwaysShowShowInColumn && 'xl:flex-row xl:gap-1',
        'flex flex-col gap-0.5 text-sm'
      )}
    >
      <span className="h-4 rounded-full w-20 my-0.5 mx-1 bg-muted animate-pulse font-bold"></span>
      <div className="flex gap-0.5 xl:gap-1">
        <span className="h-4 rounded-full w-28 my-0.5 mx-1 bg-muted animate-pulse font-bold"></span>
        {showDate && (
          <>
            <span className=" h-4 rounded-full w-40 my-0.5 mx-1 bg-muted animate-pulse font-bold"></span>
          </>
        )}
      </div>
    </div>
  );
}
