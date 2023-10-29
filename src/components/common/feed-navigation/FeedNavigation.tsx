import React from 'react';

import FeedNavigationLink from '@/components/common/feed-navigation/FeedNavigationLink';

import { cn } from '@/lib/cn';

import { FeedNavigationLinkType } from '@/types/links.type';

type FeedNavigationProps = {
  links: FeedNavigationLinkType[];
  borderBottom?: boolean;
};

export default function FeedNavigation({
  links,
  borderBottom = false,
}: FeedNavigationProps) {
  return (
    <div
      className={cn(
        `grid grid-cols-${links.length}`,
        borderBottom ? 'border-b border-gray-700' : 'border-none'
      )}
    >
      {links.map((link) => (
        <FeedNavigationLink {...link} key={link.href} />
      ))}{' '}
    </div>
  );
}
