'use client';

import { AlertOctagonIcon, RefreshCcwIcon } from 'lucide-react';
import { ErrorComponent } from 'next/dist/client/components/error-boundary';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/button';

const MainAndFollowedFeedErrorPage: ErrorComponent = ({ error, reset }) => {
  return (
    <div className="text-center flex flex-col items-center py-20 px-6">
      <AlertOctagonIcon className="w-20 h-20 text-rose-600 mb-4" />
      <h1 className="text-xl mb-4 max-w-[240px]">
        Something went wrong while loading tweets
      </h1>
      <p className="mb-8 max-w-[240px]">{error.message}</p>
      <Button
        onClick={reset}
        variant="default"
        className="flex gap-2 items-center"
      >
        <RefreshCcwIcon className="w-4 h-4" />
        <span>Try again</span>
      </Button>
      {/*<Link*/}
      {/*  href="/"*/}
      {/*  className="px-4 py-1 rounded-full bg-sky-500 max-w-fit flex gap-2 items-center"*/}
      {/*>*/}
      {/*  <RefreshCcwIcon className="w-4 h-4" />*/}
      {/*  <span>Try again</span>*/}
      {/*</Link>*/}
    </div>
  );
};
export default MainAndFollowedFeedErrorPage;
