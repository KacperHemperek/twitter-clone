import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { cn } from '@/lib/cn';

type FeedNavigationLinkProps = {
  href: string;
  label: string;
};

export default function FeedNavigationLink({
  href,
  label,
}: FeedNavigationLinkProps) {
  const pathname = usePathname();
  const active = pathname.includes(href);

  return (
    <Link
      href={href}
      className="flex items-center justify-center hover:bg-white/5"
    >
      <div>
        <h2
          className={cn(
            active ? 'font-bold' : 'text-gray-500',
            'w-fit pb-2 pt-3 mb:pb-3 mb:pt-4'
          )}
        >
          {label}
        </h2>
        <div
          className={cn(
            active ? ' bg-sky-500' : 'bg-transparent',
            'h-1 w-full rounded-full'
          )}
        />
      </div>
    </Link>
  );
}
