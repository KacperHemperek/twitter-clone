import React from 'react';

import { cn } from '@/lib/cn';

type TextClass = 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl';

const getTextSceletonHeight = (textClass: TextClass) => {
  switch (textClass) {
    case 'text-xs':
      return 'h-3 my-0.5';
    case 'text-sm':
      return 'h-3.5 my-[3px]';
    case 'text-base':
      return 'h-4 my-1';
    case 'text-lg':
      return 'h-[18px] my-[4px]';
    case 'text-xl':
      return 'h-5 my-[4px]';
  }
};

export default function TextSceleton({
  textClass,
  widthClass = 'text-base',
}: {
  widthClass: string;
  textClass: TextClass;
}) {
  return (
    <div
      className={cn(
        'animate-pulse bg-muted rounded-full h-5 text-xl',
        widthClass,
        getTextSceletonHeight(textClass)
      )}
    />
  );
}
