import React from 'react';

import MainWrapper from '@/components/layout/MainWrapper';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center text-white">
      <MainWrapper
        headerComponent={
          <div className="flex w-full flex-col">
            <h1 className="p-4 text-xl font-bold md:text-[24px]">Login</h1>
          </div>
        }
      >
        {children}
      </MainWrapper>
    </div>
  );
}
