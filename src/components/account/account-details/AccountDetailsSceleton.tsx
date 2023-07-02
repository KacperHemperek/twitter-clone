import React from 'react';

import TextSceleton from '@/components/common/sceletons/TextSceleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import AccountSubInfoSceleton from '../account-sub-info/AccountSubInfoSceleton';

export default function AccountDetailsSceleton() {
  return (
    <div className="flex flex-col">
      <div className="aspect-[3/1] w-full bg-muted animate-pulse"></div>
      <div className="flex flex-col gap-4 sm:gap-6 p-4">
        <div className="flex justify-between relative">
          <div />
          <div className="p-1 bg-background rounded-full absolute -translate-y-[60%] max-w-[128px] min-w-[84px] w-1/4 aspect-square">
            <Avatar className="w-full h-full bg-muted animate-pulse">
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-row gap-2">
            <div className="bg-muted animate-pulse rounded-full w-42 h-8" />
          </div>
        </div>

        <div className={'flex flex-col leading-[22px]'}>
          <TextSceleton textClass="text-xl" widthClass="w-32" />
          <TextSceleton textClass="text-sm" widthClass="w-24" />
        </div>

        <div className="flex flex-col">
          <TextSceleton textClass="text-base" widthClass="w-full" />
          <TextSceleton textClass="text-base" widthClass="w-11/12" />
          <TextSceleton textClass="text-base" widthClass="w-1/2" />
        </div>

        <div className="flex flex-wrap text-gray-400 gap-x-3 gap-y-1.5">
          <AccountSubInfoSceleton width="w-32" />
          <AccountSubInfoSceleton width="w-36" />
          <AccountSubInfoSceleton />
        </div>

        <div className="flex gap-3">
          <div className="flex gap-1">
            <TextSceleton textClass="text-sm" widthClass="w-8" />
            <TextSceleton textClass="text-sm" widthClass="w-20" />
          </div>
          <div className="flex gap-1">
            <TextSceleton textClass="text-sm" widthClass="w-7" />
            <TextSceleton textClass="text-sm" widthClass="w-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
