'use client';
import React from 'react';
import { Button } from './ui/button';
import { signIn, signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <Button className='w-fit' onClick={() => signOut()}>
      Sign Out
    </Button>
  );
}

export function SignInButton() {
  return (
    <Button variant={'outline'} className='w-fit' onClick={() => signIn()}>
      Sign In
    </Button>
  );
}
