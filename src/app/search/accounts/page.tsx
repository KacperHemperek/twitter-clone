'use client';

import { SearchUsersResult } from '@/app/api/search/search.service';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { AccountBio } from '@/components/account/account-details/AccountDescription';
import { FollowButton } from '@/components/account/follow-button/FollowButton';
import TweetUserInfo from '@/components/common/tweet-user-info/TweetUserInfo';
import TweetUserInfoSceleton from '@/components/common/tweet-user-info/TweetUserInfoSceleton';
import TweetAvatar from '@/components/feed/TweetAvatar';
import { SearchBanner } from '@/components/search/SearchBanner';

import { ErrorResponse } from '@/types/api/error';
import { PaginatedResponse } from '@/types/api/pagination';

function SearchAccountsListSceleton({ amount = 5 }: { amount?: number }) {
  return (
    <>
      {Array.from({ length: amount }).map((_, idx) => (
        <div className="flex flex-col p-3 border-b overflow-hidden" key={idx}>
          <div className="flex gap-3 overflow-hidden">
            {/* Avatar skeleton */}
            <div className="w-12 h-12 rounded-full bg-muted animate-pulse flex-shrink-0" />
            <div className="flex flex-col w-full overflow-hidden">
              <div className="flex w-full justify-between items-start md:grow overflow-hidden">
                {/* User info skeleton */}
                <TweetUserInfoSceleton
                  alwaysShowShowInColumn={true}
                  showDate={false}
                />
                {/* Follow button skeleton */}
                <div className="w-20 h-8 bg-muted rounded-full animate-pulse ml-2" />
              </div>
              {/* Bio skeleton */}
              <div className="w-3/4 h-4 bg-muted rounded mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function AccountSearchList({ accounts }: { accounts: SearchUsersResult[] }) {
  const session = useSession();
  const { width } = useWindowSize();

  const followsYou = (account: SearchUsersResult) => {
    return (
      !!session.data &&
      account.following.some((f) => f.id === session.data.user.id)
    );
  };

  const followedByYou = (account: SearchUsersResult) =>
    !!session.data &&
    account.followers.some((f) => f.id === session.data.user.id);

  return (
    <>
      {accounts.map((account) => (
        <>
          <div
            className="flex flex-col p-3 border-b overflow-hidden"
            key={account.id}
          >
            <div className="flex gap-3 overflow-hidden">
              <TweetAvatar
                authorId={account.id}
                authorName={account.name}
                image={account.image}
              />
              <div className="flex flex-col w-full overflow-hidden">
                <div className="flex w-full justify-between items-start md:grow overflow-hidden">
                  <TweetUserInfo
                    authorName={account.name}
                    authorEmail={account.email}
                    alwaysShowShowInColumn
                    followsYou={followsYou(account)}
                    className="pb-1"
                  />
                  {!!session.data?.user.id &&
                    session.data.user.id !== account.id && (
                      <FollowButton
                        isFollowing={followedByYou(account)}
                        queryKey={['unexisting']}
                        userId={account.id}
                        username={account.name ?? account.email ?? ''}
                        compact={width <= 768}
                      />
                    )}
                </div>
                <AccountBio bio={account.description} />
              </div>
            </div>
          </div>
        </>
      ))}
    </>
  );
}

const searchAccounts = async (searchParams: {
  page: string;
  q: string;
}): Promise<PaginatedResponse<SearchUsersResult>> => {
  const page = searchParams.page ? searchParams.page : '1';
  const q = searchParams.q;

  const params = new URLSearchParams({ page, q });

  const res = await fetch(`/api/search/accounts?${params.toString()}`);

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;

    throw new Error(error.message, {
      cause: {
        status: res.status,
        cause: error.cause,
      },
    });
  }

  return await res.json();
};

const getSearchAccountsQueryKey = (searchQ: string) => [
  'searchAccounts',
  searchQ,
];

export default function AccountSearchPage() {
  const params = useSearchParams();
  const searchQ = params.get('q');

  const canSearch = !!searchQ && searchQ.trim().length > 0;

  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: getSearchAccountsQueryKey(searchQ!),
    queryFn: ({ pageParam }) =>
      searchAccounts({ page: pageParam, q: searchQ! }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: canSearch,
  });

  if (!canSearch) {
    return (
      <SearchBanner
        title="Search for accounts"
        description="Find people you know but their nickname"
      />
    );
  }

  // TODO: create loading sceletons for accounts search results
  if (isLoading) return <SearchAccountsListSceleton />;

  if (!data)
    return (
      <SearchBanner title="No results" description="Try different keywords" />
    );

  return (
    <AccountSearchList
      accounts={data?.pages.flatMap((page) => page.data) || []}
    />
  );
}
