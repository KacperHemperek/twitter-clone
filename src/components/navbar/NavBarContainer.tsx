'use client';
import { TwitterIcon } from 'lucide-react';
import React from 'react';
import { useSession } from 'next-auth/react';
import AvatarDropdown from './AvatarDropdown';

export default function NavBarContainer() {
  const session = useSession();

  return (
    <div className='sticky right-full top-0 flex h-screen flex-col justify-between px-2 py-4 md:px-4 '>
      <div className='flex flex-col'>
        <div className='p-1'>
          <TwitterIcon className='h-6 w-6 md:h-8 md:w-8' />
        </div>
      </div>
      <div>
        <AvatarDropdown
          image={session.data?.user?.image ?? undefined}
          firstLetter={session.data?.user?.name?.[0]}
        />
      </div>
    </div>
  );
}
