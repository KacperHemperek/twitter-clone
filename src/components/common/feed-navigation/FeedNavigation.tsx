import { Link } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';

import FeedNavigationLink from '@/components/common/feed-navigation/FeedNavigationLink';

import { cn } from '@/lib/cn';

type FeedNavigationProps = {
  links: { label: string; href: string }[];
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
