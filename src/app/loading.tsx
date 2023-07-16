import { TwitterIcon } from 'lucide-react';
import React from 'react';

import MainWrapper from '@/components/layout/MainWrapper';

export default function RootLoading() {
  return (
    <MainWrapper>
      <div className="h-screen bg-background flex items-center justify-center">
        <TwitterIcon className="text-white animate-pulse w-12 h-12" />
      </div>
    </MainWrapper>
  );
}
