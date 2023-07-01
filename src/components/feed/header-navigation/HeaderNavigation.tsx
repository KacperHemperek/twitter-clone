'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { cn } from '@/lib/cn';

export default function HeaderNavigation() {
  const pathname = usePathname();
  const isHomeFeed = pathname.includes('/feed/main');

  return (
    <div className="grid grid-cols-2">
      <Link
        href={'/feed/main'}
        className="flex items-center justify-center hover:bg-white/5"
      >
        <div>
          <h2
            className={cn(
              isHomeFeed ? 'font-bold' : 'text-gray-500',
              'w-fit pb-2 pt-3 mb:pb-3 mb:pt-4'
            )}
          >
            Home
          </h2>
          <div
            className={cn(
              isHomeFeed ? ' bg-sky-500' : 'bg-transparent',
              'h-1 w-full rounded-full'
            )}
          />
        </div>
      </Link>
      <Link
        href={'/feed/followed'}
        className="flex items-center justify-center hover:bg-white/5"
      >
        <div>
          <h2
            className={cn(
              !isHomeFeed ? 'font-bold' : 'text-gray-500',
              'w-fit pb-2 pt-3 mb:pb-3 mb:pt-4'
            )}
          >
            Followed
          </h2>
          <div
            className={cn(
              !isHomeFeed ? ' bg-sky-500' : 'bg-transparent',
              'h-1 w-full rounded-full'
            )}
          />
        </div>
      </Link>
    </div>
  );
}
