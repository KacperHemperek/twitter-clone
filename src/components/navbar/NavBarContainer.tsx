'use client';

import AvatarDropdown from './AvatarDropdown';
import { HomeIcon, SearchIcon, TwitterIcon, UserIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

export default function NavBarContainer() {
  const session = useSession();

  return (
    <div className="sticky right-full top-0 flex h-[100dvh] w-16 md:w-72 flex-col justify-between items-center md:items-start px-2 pb-4 pt-2 md:px-4 ">
      <div className="flex flex-col justify-center space-y-2">
        <div className="p-3 rounded-full hover:bg-gray-600/30 transition-all max-w-fit md:mb-2">
          <TwitterIcon className="h-6 w-6 md:h-8 md:w-8" />
        </div>
        <Link
          href={'/feed/main'}
          className="p-3 gap-6 flex rounded-full hover:bg-gray-600/30 items-center transition-all max-w-fit cursor-pointer"
        >
          <HomeIcon className="h-6 w-6 md:h-8 md:w-8" />
          <p className="text-xl md:mr-3 hidden md:inline">Home</p>
        </Link>
        <Link
          href={`/account/${session.data?.user.id}/tweets`}
          className="p-3 gap-6 flex rounded-full hover:bg-gray-600/30 items-center transition-all max-w-fit cursor-pointer"
        >
          <UserIcon className="h-6 w-6 md:h-8 md:w-8" />
          <p className="text-xl md:mr-3 hidden md:inline">Profile</p>
        </Link>
        <Link
          href={`/search/tweets`}
          className="p-3 gap-6 flex rounded-full hover:bg-gray-600/30 items-center transition-all max-w-fit cursor-pointer"
        >
          <SearchIcon className="h-6 w-6 md:h-8 md:w-8" />
          <p className="text-xl md:mr-3 hidden md:inline">Search</p>
        </Link>
      </div>

      <AvatarDropdown
        id={session.data?.user.id}
        image={session.data?.user?.image ?? undefined}
        name={session.data?.user?.name ?? undefined}
        email={session.data?.user.email ?? undefined}
      />
    </div>
  );
}
