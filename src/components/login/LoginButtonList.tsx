'use client';

import { ClientSafeProvider, signIn } from 'next-auth/react';
import React from 'react';

import { Button } from '@/components/ui/button';

export default function LoginButtonList({
  providers,
}: {
  providers: ClientSafeProvider[];
}) {
  return (
    <div className="flex flex-col space-y-4">
      {providers.map((provider) => (
        <Button
          key={provider.id}
          variant="default"
          className="w-full"
          onClick={() => signIn(provider.id)}
        >
          Login with {provider.name}
        </Button>
      ))}
    </div>
  );
}
