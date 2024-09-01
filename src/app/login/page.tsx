import { auth, config } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

import LoginButtonList from '@/components/login/LoginButtonList';
import LoginPageDescription from '@/components/login/LoginPageDescription';

export default async function LoginPage() {
  const session = await auth();

  if (session) {
    return redirect('/feed/main');
  }

  if (!config.providers) {
    redirect('/feed/main');
  }

  const providersList = config.providers.map((p: any) => ({
    id: p.id,
    name: p.name,
  }));

  return (
    <div className="flex-1 flex items-center p-6">
      <div className="flex mx-auto flex-col max-w-sm text-muted-foreground">
        <LoginPageDescription />
        <LoginButtonList providers={providersList} />
        <p className="pt-6">
          Don&#39;t want to login?{' '}
          <Link
            className="underline text-sky-500 hover:opacity-80 transition-opacity"
            href="/feed/main"
          >
            Go to main feed
          </Link>
        </p>
      </div>
    </div>
  );
}
