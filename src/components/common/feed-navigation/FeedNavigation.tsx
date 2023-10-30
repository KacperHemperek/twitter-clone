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
  const gridCols: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  const key = links.length;

  const gridColsKey = key in gridCols ? key : 1;

  return (
    <div
      className={cn(
        'grid',
        borderBottom ? 'border-b border-gray-700' : 'border-none',
        gridCols[gridColsKey]
      )}
    >
      {links.map((link) => (
        <FeedNavigationLink {...link} key={link.href} />
      ))}
    </div>
  );
}
