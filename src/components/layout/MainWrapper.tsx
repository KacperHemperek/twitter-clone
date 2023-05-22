import React, { PropsWithChildren } from 'react';

type MainWrapperProps = PropsWithChildren & {
  headerComponent: React.ReactNode;
};

export default function MainWrapper({
  children,
  headerComponent,
}: MainWrapperProps) {
  return (
    <div className='refative flex h-full min-h-screen w-full flex-col border-x border-x-gray-700'>
      <div className='sticky left-0 right-0 top-0 z-10 w-full border-b border-b-gray-700 bg-background/10 backdrop-blur-lg'>
        {headerComponent}
      </div>
      {children}
    </div>
  );
}
