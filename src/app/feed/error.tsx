'use client';

import { AlertOctagonIcon, ArrowLeftIcon, RefreshCcwIcon } from 'lucide-react';
import { ErrorComponent } from 'next/dist/client/components/error-boundary';
import Link from 'next/link';
import React from 'react';

import { NextError } from 'next/dist/lib/is-error';

const MainAndFollowedFeedErrorPage: ErrorComponent = ({ error, reset }) => {
  console.log('error', error);
  return (
    <div className="text-center flex flex-col items-center py-20 px-6">
      <AlertOctagonIcon className="w-20 h-20 text-rose-600 mb-4" />
      <h1 className="text-xl mb-8 max-w-[240px]">
        Something went wrong while loading tweets
      </h1>
      <p>{error.message}</p>
      <Link
        href="/"
        className="px-4 py-1 rounded-full bg-sky-500 max-w-fit flex gap-2 items-center"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span>Go to homepage</span>
      </Link>
    </div>
  );
};

export default MainAndFollowedFeedErrorPage;
