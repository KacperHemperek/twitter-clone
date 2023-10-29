'use client';

import { LogIn, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';
import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function AvatarDropdown({
  id,
  image,
  name,
  email,
}: {
  id?: string;
  image?: string;
  name?: string;
  email?: string;
}) {
  if (!id) {
    return (
      <button
        onClick={() => signIn()}
        className="p-3 gap-6 flex rounded-full hover:bg-gray-600/30 items-center transition-all cursor-pointer w-full"
      >
        <LogIn className="h-6 w-6 md:h-8 md:w-8" />
        <p className="text-xl md:mr-3 hidden md:inline">Login</p>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={true}>
        <div className="flex cursor-pointer items-center md:gap-3 rounded-full p-2 outline-none transition-all hover:bg-gray-600/30 w-min md:w-full">
          <Avatar className="h-8 w-8 md:h-10 md:w-10">
            <AvatarImage src={image ?? undefined} />
            <AvatarFallback>{name?.[0] ?? ''}</AvatarFallback>
          </Avatar>

          <div className="hidden flex-col md:block flex-grow-1 overflow-hidden">
            <h3 className="truncate font-bold">{name}</h3>
            <p className="truncate text-gray-500">{`@${email}`}</p>
          </div>
          <div>
            <SettingsIcon className="hidden h-4 w-4 md:flex" />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end">
        <Link href={`/account/${id}/tweets`}>
          <DropdownMenuItem className="flex items-center gap-2 p-3">
            <UserIcon className="h-4 w-4" />
            <span>Account</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          className="flex items-center gap-2 p-3"
          onClick={() => signOut()}
        >
          <LogOutIcon className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
