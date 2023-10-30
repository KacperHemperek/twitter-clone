'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import LoginDialog from '@/components/common/LoginDialog';

import { cn } from '@/lib/cn';

import { FeedNavigationLinkType } from '@/types/links.type';

type FeedNavigationLinkProps = FeedNavigationLinkType;

export default function FeedNavigationLink({
  href,
  label,
  needsLogin = false,
}: FeedNavigationLinkProps) {
  const pathname = usePathname();
  const active = href.includes(pathname);
  const { data: session } = useSession();

  if (needsLogin && !session) {
    return (
      <LoginDialog
        trigger={
          <button className="flex items-center justify-center hover:bg-white/5">
            <div>
              <h2 className="w-fit pb-2 pt-3 mb:pb-3 mb:pt-4 text-gray-500">
                {label}
              </h2>
              <div className="h-1 w-full rounded-full bg-transparent" />
            </div>
          </button>
        }
      />
    );
  }

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
