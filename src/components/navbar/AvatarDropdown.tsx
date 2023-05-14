'use client';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AvatarDropdown({
  image,
  name,
  email,
}: {
  image?: string;
  name?: string;
  email?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={true}>
        <div className='outline-none p-2 hover:bg-gray-600/30 rounded-full flex gap-3 transition-all min-w-[240px] items-center cursor-pointer'>
          <Avatar className='h-8 w-8 md:h-10 md:w-10'>
            <AvatarImage src={image ?? undefined} />
            <AvatarFallback>{name?.[0] ?? 'A'}</AvatarFallback>
          </Avatar>
          <div className='flex-col hidden md:flex flex-1 max-w-[150px]'>
            <h3 className='font-bold truncate'>{name}</h3>
            <p className='text-gray-500 truncate'>{`@${email}`}</p>
          </div>

          <SettingsIcon className='w-4 h-4 hidden md:block' />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='top' align='end'>
        <DropdownMenuItem className='flex items-center gap-2 p-3'>
          <UserIcon className='h-4 w-4' />
          <span>Account</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='flex items-center gap-2 p-3'
          onClick={() => signOut()}
        >
          <LogOutIcon className='h-4 w-4' />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
