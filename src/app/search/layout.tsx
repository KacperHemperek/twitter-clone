'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useMemo, useRef, useState } from 'react';

import SectionHeader from '@/components/account/AccountHeader';
import FeedNavigation from '@/components/common/feed-navigation/FeedNavigation';
import MainWrapper from '@/components/layout/MainWrapper';
import { SearchBar } from '@/components/search/SearchBar';

export default function SearchLayout({ children }: { children: ReactNode }) {
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [links, setLinks] = useState<Array<{ href: string; label: string }>>([
    { href: '/search/tweets', label: 'Tweets' },
    {
      href: '/search/accounts',
      label: 'Accounts',
    },
  ]);

  const onSearch = () => {
    const searchQ = searchRef.current?.value.trim();

    if (!searchQ || !searchQ.length) return;

    setLinks([
      { href: `/search/tweets${searchQ && `?q=${searchQ}`}`, label: 'Tweets' },
      {
        href: `/search/accounts${searchQ && `?q=${searchQ}`}`,
        label: 'Accounts',
      },
    ]);
    router.push(`${pathname}?q=${searchRef.current?.value}`);
    console.log('search', searchRef.current?.value);
  };

  return (
    <MainWrapper headerComponent={<SectionHeader title="Search" />}>
      <SearchBar ref={searchRef} onSearch={onSearch} />
      <FeedNavigation links={links} borderBottom />

      {children}
    </MainWrapper>
  );
}
