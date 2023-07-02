import React from 'react';

import TextSceleton from '@/components/common/sceletons/TextSceleton';

export default function AccountSubInfoSceleton({
  width = 'w-24',
}: {
  width?: string;
}) {
  return (
    <div className="flex gap-2 items-center text-sm">
      <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
      <TextSceleton textClass="text-sm" widthClass={width} />
    </div>
  );
}
