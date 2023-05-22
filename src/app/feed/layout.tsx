import HeaderNavigation from '@/components/feed/HeaderNavigation';
import MainWrapper from '@/components/layout/MainWrapper';
import React, { PropsWithChildren } from 'react';

export default function layout({ children }: PropsWithChildren) {
  return (
    <div className='flex min-h-screen w-full flex-col items-center text-white'>
      <MainWrapper
        headerComponent={
          <div className='flex w-full flex-col '>
            <h1 className='p-4 text-xl font-bold md:text-[24px]'>Home</h1>
            <HeaderNavigation />
          </div>
        }
      >
        {children}
      </MainWrapper>
    </div>
  );
}
