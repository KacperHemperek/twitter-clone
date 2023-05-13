import React, { PropsWithChildren } from 'react';
export default function layout({ children }: PropsWithChildren) {
  return (
    <div className='flex min-h-screen w-full flex-col items-center text-white'>
      <div className='refative flex h-full min-h-screen w-full flex-col border-x border-x-gray-700'>
        <div className='sticky left-0 right-0 top-0 z-10 flex w-full flex-col border-b border-b-gray-700 bg-background/10 p-4 backdrop-blur-lg md:p-4'>
          <h1 className='text-xl font-bold md:text-[24px]'>Home</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
