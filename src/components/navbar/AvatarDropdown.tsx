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
      <DropdownMenuTrigger className='outline-none'>
        <Avatar>
          <AvatarImage src={image ?? undefined} />
          <AvatarFallback className='text-black'>
            {firstLetter ?? 'A'}
          </AvatarFallback>
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
