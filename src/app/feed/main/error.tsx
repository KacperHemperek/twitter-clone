'use client';

import { AlertOctagonIcon, RefreshCcwIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function MainAndFollowedFeedErrorPage() {
  return (
    <div className="text-center flex flex-col items-center py-20 px-6">
      <AlertOctagonIcon className="w-20 h-20 text-rose-600 mb-4" />
      <h1 className="text-xl mb-8 max-w-[240px]">
        Something went wrong while loading tweets
      </h1>
      <Link
        href="/"
        className="px-4 py-1 rounded-full bg-sky-500 max-w-fit flex gap-2 items-center"
      >
        <RefreshCcwIcon className="w-4 h-4" />
        <span>Try again</span>
      </Link>
    </div>
  );
}
