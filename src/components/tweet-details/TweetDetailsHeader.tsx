'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function TweetDetailsHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 p-4">
      <div>
        <ArrowLeft
          className=" mt-0.5  cursor-pointer"
          onClick={() => router.back()}
        />
      </div>
      <h1 className="mt-0.5 text-xl font-bold md:text-[22px]">Tweet</h1>
    </div>
  );
}
