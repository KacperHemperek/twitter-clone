'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import SearchAccountCard from '@/components/search/SearchAccountCard';

import { ErrorResponse } from '@/types/api/error';
import { PaginatedResponse } from '@/types/api/pagination';

export const getQueryKey = (searchQ: string) => ['searchUsers', searchQ];
export const SEARCH_USERS_QUERY_KEY = ['searchUsers'];

type UserResult = {
  name: string | null;
  description: string | null;
  email: string | null;
  id: string;
  location: string | null;
  image: string | null;
  followers: {
    id: string;
  }[];
};

const searchAccounts = async (searchParams: {
  page: string;
  q: string;
}): Promise<PaginatedResponse<UserResult>> => {
  const page = searchParams.page ? searchParams.page : '1';
  const q = searchParams.q;

  const params = new URLSearchParams({ page, q });

  const res = await fetch(`/api/search/users?${params.toString()}`);

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;

    throw new Error(error.message, {
      cause: {
        status: res.status,
        cause: error.cause,
      },
    });
  }

  const data = await res.json();

  return data;
};

export default function AccountSearchPage() {
  const { data: session } = useSession();
  const params = useSearchParams();
  const q = params.get('q');

  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: SEARCH_USERS_QUERY_KEY,
    queryFn: async ({ pageParam }) =>
      searchAccounts({
        page: pageParam,
        q: q!,
      }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!q,
  });

  const usersToDisplay = useMemo(() => {
    return data?.pages.map((page) => page.data).flat();
  }, [data]);

  return (
    <div className="text-2xl">
      {usersToDisplay?.map((user) => (
        <SearchAccountCard
          key={'user__' + user.id}
          name={user.name ?? ''}
          email={user.email ?? ''}
          description={user.description}
          image={user.image ?? ''}
          id={user.id}
          isFollowing={user.followers.some(
            (follower) => follower.id === session?.user.id
          )}
        />
      ))}
    </div>
  );
}
