'use client';

import { RefreshCcwIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function MainAndFollowedFeedErrorPage() {
  return (
    <div className="text-center flex flex-col gap-4 items-center py-20 px-6">
      <p className="text-xl">Something went wrong while loading tweets</p>
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
