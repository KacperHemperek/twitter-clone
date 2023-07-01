import { Link } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';

import FeedNavigationLink from '@/components/common/feed-navigation/FeedNavigationLink';

type FeedNavigationProps = {
  links: { label: string; href: string }[];
};

export default function FeedNavigation({ links }: FeedNavigationProps) {
  return (
    <div className={`grid grid-cols-${links.length}`}>
      {links.map((link) => (
        <FeedNavigationLink {...link} key={link.href} />
      ))}{' '}
    </div>
  );
}
