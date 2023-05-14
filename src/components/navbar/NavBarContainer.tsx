'use client';
import { TwitterIcon, HomeIcon, UserIcon } from 'lucide-react';
import React from 'react';
import { useSession } from 'next-auth/react';
import AvatarDropdown from './AvatarDropdown';

export default function NavBarContainer() {
  const session = useSession();

  return (
    <div className='sticky right-full top-0 flex h-screen flex-col justify-between items-center md:items-start px-2 pb-4 pt-2 md:px-4 '>
      <div className='flex flex-col justify-center space-y-2'>
        <div className='p-3 rounded-full hover:bg-gray-600/30 transition-all max-w-fit md:mb-2'>
          <TwitterIcon className='h-6 w-6 md:h-8 md:w-8' />
        </div>
        <div className='p-3 gap-6 flex rounded-full hover:bg-gray-600/30 items-center transition-all max-w-fit cursor-pointer'>
          <HomeIcon className='h-6 w-6 md:h-8 md:w-8' />
          <p className='text-xl md:mr-3 font-bold hidden md:inline'>Home</p>
        </div>
        <div className='p-3 gap-6 flex rounded-full hover:bg-gray-600/30 items-center transition-all max-w-fit cursor-pointer'>
          <UserIcon className='h-6 w-6 md:h-8 md:w-8' />
          <p className='text-xl md:mr-3 hidden md:inline'>Profile</p>
        </div>
      </div>

      <AvatarDropdown
        image={session.data?.user?.image ?? undefined}
        name={session.data?.user?.name ?? undefined}
        email={session.data?.user.email ?? undefined}
      />
    </div>
  );
}
