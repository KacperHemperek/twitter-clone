import { authOptions } from '@/utils/next-auth';
import { getServerSession } from 'next-auth';
import { getProviders } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

import LoginButtonList from '@/components/login/LoginButtonList';
import LoginPageDescription from '@/components/login/LoginPageDescription';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    return redirect('/feed/main');
  }

  const providers = await getProviders();

  const providerList = Object.values(providers ?? {});

  if (!providers) {
    redirect('/feed/main');
  }

  return (
    <div className="flex-1 flex items-center p-6">
      <div className="flex mx-auto flex-col max-w-sm text-muted-foreground">
        <LoginPageDescription />
        <LoginButtonList providers={providerList} />
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
