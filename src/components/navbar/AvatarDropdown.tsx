'use client';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { LogOutIcon, UserIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AvatarDropdown({
  image,
  firstLetter,
}: {
  image?: string;
  firstLetter?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='outline-none p-2 hover:bg-gray-600/30 rounded-full transition-all'>
        <Avatar className='h-8 w-8 md:h-10 md:w-10'>
          <AvatarImage src={image ?? undefined} />
          <AvatarFallback>{firstLetter ?? 'A'}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='top' align='start'>
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
