'use client';

import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import MainWrapper from '@/components/layout/MainWrapper';

export default function UserErrorPage() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <MainWrapper>
      <div className="w-full h-full flex items-center justify-center  p-10 flex-col text-center">
        <h1 className="text-2xl text-center mb-2">
          Couldn&lsquo;t find the user you&lsquo;re looking for 🫤
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure this user exists? If so{' '}
          <Link className="text-sky-500" href={pathname}>
            try again!
          </Link>
        </p>
        <Link
          href={'/'}
          className="bg-sky-500 flex text-white items-center gap-2 text-background px-4 py-1.5 rounded-full font-bold transition-colors "
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <button>Back to home</button>
        </Link>
      </div>
    </MainWrapper>
  );
}
