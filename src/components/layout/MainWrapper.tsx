import React, { PropsWithChildren } from 'react';

import { cn } from '@/lib/cn';

type MainWrapperProps = PropsWithChildren & {
  headerComponent?: React.ReactNode;
  showBorder?: boolean;
};

export default function MainWrapper({
  children,
  headerComponent,
  showBorder = true,
}: MainWrapperProps) {
  return (
    <div className="refative flex h-full min-h-screen w-full flex-col border-x border-x-gray-700">
      <div
        className={cn(
          showBorder && 'border-b',
          'sticky left-0 right-0 top-0 z-10 w-full border-b-gray-700 bg-background/10 backdrop-blur-lg'
        )}
      >
        {headerComponent}
      </div>
      {children}
    </div>
  );
}
