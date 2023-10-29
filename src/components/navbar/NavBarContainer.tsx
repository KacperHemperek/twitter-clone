'use client';

import AvatarDropdown from './AvatarDropdown';
import { HomeIcon, SearchIcon, TwitterIcon, UserIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

import LoginDialog from '@/components/common/LoginDialog';

function NavLink({
  icon,
  text,
  href,
}: {
  icon: React.ReactNode;
  text: string;
  href: string;
}) {
  const { data: session } = useSession();

  if (!session)
    return (
      <LoginDialog
        trigger={
          <button className="p-3 gap-6 flex rounded-full hover:bg-gray-600/30 items-center transition-all max-w-fit cursor-pointer">
            {icon}
            <p className="text-xl md:mr-3 hidden md:inline">{text}</p>
          </button>
        }
      />
    );

  return (
    <Link
      href={href}
      className="p-3 gap-6 flex rounded-full hover:bg-gray-600/30 items-center transition-all max-w-fit cursor-pointer"
    >
      {icon}
      <p className="text-xl md:mr-3 hidden md:inline">{text}</p>
    </Link>
  );
}

export default function NavBarContainer() {
  const session = useSession();

  return (
    <div className="sticky right-full top-0 flex h-[100dvh] w-16 md:w-72 flex-col justify-between items-center md:items-start px-2 pb-4 pt-2 md:px-4 ">
      <div className="flex flex-col justify-center space-y-2">
        <div className="p-3 rounded-full hover:bg-gray-600/30 transition-all max-w-fit md:mb-2">
          <TwitterIcon className="h-6 w-6 md:h-8 md:w-8" />
        </div>
        <NavLink
          href="/feed/main"
          icon={<HomeIcon className="h-6 w-6 md:h-8 md:w-8" />}
          text="Home"
        />
        <NavLink
          href={`/account/${session.data?.user.id}/tweets`}
          icon={<UserIcon className="h-6 w-6 md:h-8 md:w-8" />}
          text="Profile"
        />

        <NavLink
          href={`/search/tweets`}
          icon={<SearchIcon className="h-6 w-6 md:h-8 md:w-8" />}
          text="Search"
        />
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
