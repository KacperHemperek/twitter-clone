import React from 'react';

import TweetUserInfoSceleton from '@/components/common/tweet-user-info/TweetUserInfoSceleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function TweetDetailsSceleton() {
  return (
    <div className="flex flex-col p-4">
      <div className="flex gap-2">
        <Avatar>
          <AvatarFallback className="bg-muted animate-pulse"></AvatarFallback>
        </Avatar>
        <TweetUserInfoSceleton showDate={false} alwaysShowShowInColumn={true} />
      </div>
      <div className="space-y-4 flex flex-col border-b border-gray-700 py-3.5 w-full">
        <span className="rounded-full h-5 my-0.5 bg-muted animate-pulse w-full"></span>
        <span className="rounded-full h-5 my-0.5 bg-muted animate-pulse w-full"></span>
        <span className="rounded-full h-5 my-0.5 bg-muted animate-pulse w-48"></span>
        <p className=" rounded-full h-5 my-0.5 bg-muted animate-pulse w-32"></p>
      </div>
      <div className="grid grid-cols-3 border-b border-gray-700 py-3.5">
        <div className="flex items-center justify-center">
          <span className="rounded-full h-5 my-0.5 bg-muted animate-pulse w-24"></span>
        </div>
        <div className="flex items-center justify-center">
          <span className="rounded-full h-5 my-0.5 bg-muted animate-pulse w-24"></span>
        </div>
        <div className="flex items-center justify-center">
          <span className="rounded-full h-5 my-0.5 bg-muted animate-pulse w-24"></span>
        </div>
      </div>
      <div className="grid grid-cols-3 border-b border-gray-700 py-3.5">
        <div className="flex justify-center">
          <div className="aspect-square w-6 rounded-full bg-muted animate-pulse"></div>
        </div>
        <div className="flex justify-center">
          <div className="aspect-square w-6 rounded-full bg-muted animate-pulse"></div>
        </div>
        <div className="flex justify-center">
          <div className="aspect-square w-6 rounded-full bg-muted animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
