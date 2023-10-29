import React, { PropsWithChildren } from 'react';

import FeedNavigation from '@/components/common/feed-navigation/FeedNavigation';
import MainWrapper from '@/components/layout/MainWrapper';

import { FeedNavigationLinkType } from '@/types/links.type';

const links: FeedNavigationLinkType[] = [
  {
    href: '/feed/main',
    label: 'Home',
  },
  {
    href: '/feed/followed',
    label: 'Followed',
    needsLogin: true,
  },
];

export default function layout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center text-white">
      <MainWrapper
        headerComponent={
          <div className="flex w-full flex-col ">
            <h1 className="p-4 text-xl font-bold md:text-[24px]">Home</h1>
            <FeedNavigation links={links} />
          </div>
        }
      >
        {children}
      </MainWrapper>
    </div>
  );
}
