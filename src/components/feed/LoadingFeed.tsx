import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function TweetLoader() {
  return (
    <div className='flex space-x-3 border-b border-gray-700 p-3 text-sm'>
      <Avatar className='z-0 h-10 w-10'>
        <AvatarFallback className='text-white animate-pulse'></AvatarFallback>
      </Avatar>
      <div className='flex-grow space-y-1'>
        <div className='flex items-center space-x-1'>
          <h5 className='font-bold'></h5>
          <div className='h-4 my-1 w-24 bg-muted rounded-full animate-pulse'></div>
          <div className='h-4 my-1 w-24 bg-muted rounded-full animate-pulse'></div>
        </div>
        <div className='h-4 my-1 w-full bg-muted rounded-full animate-pulse'></div>
        <div className='h-4 my-1 w-5/6 bg-muted rounded-full animate-pulse'></div>
        <div className='h-4 my-1 w-2/5 bg-muted rounded-full animate-pulse'></div>

        <div className='grid grid-cols-3 mt-2'>
          <div className='h-4 my-1 w-10 bg-muted rounded-full animate-pulse'></div>

          <div className='h-4 my-1 w-10 bg-muted rounded-full animate-pulse'></div>

          <div className='h-4 my-1 w-10 bg-muted rounded-full animate-pulse'></div>
        </div>
      </div>
    </div>
  );
}

export default function FeedLoading() {
  return (
    <>
      {[...Array(15)].map((_, idx) => (
        <TweetLoader key={idx} />
      ))}
    </>
  );
}
