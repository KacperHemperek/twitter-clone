import { TwitterIcon } from 'lucide-react';
import React from 'react';

export default function RootLoading() {
  return (
    <div className="w-screen h-screen bg-background flex items-center justify-center">
      <TwitterIcon className="text-white animate-pulse" />
    </div>
  );
}
