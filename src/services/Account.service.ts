import { Prisma } from '@prisma/client';

import { UpdateAccountDetailsBody } from '@/app/api/user/[userId]/(controllers)/updateAccountDetails.controller';

import { AccountDetails } from '@/types/AccountDetails.type';
import { Tweet } from '@/types/Tweet.type';
import { PaginatedResponse } from '@/types/api/pagination';

export const GET_ACCOUNT_DETAILS_TAGS = ['accountDetails'];

export async function getAccoundDetails(
  userId: string
): Promise<AccountDetails> {
  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/user/${userId}`;
  const res = await fetch(url, { next: { tags: GET_ACCOUNT_DETAILS_TAGS } });
  const data: { data: AccountDetails } = await res.json();
  if (!res.ok) {
    throw new Error("Couldn't get user information");
  }

  return data.data;
}

export async function updateAccountDetails(
  userId: string,
  data: UpdateAccountDetailsBody
) {
  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/user/${userId}`;

  const res = await fetch(url, { method: 'PUT', body: JSON.stringify(data) });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error?.message ?? 'Error occured while updating user information',
      {
        cause: res.statusText,
      }
    );
  }
}

export async function getUsersTweets(
  userId: string,
  page?: number
): Promise<PaginatedResponse<Tweet>> {
  const url = `/api/user/${userId}/tweets${page ? `?page=${page}` : ''}`;

  const res = await fetch(url, { method: 'GET', cache: 'no-cache' });

  if (!res.ok) {
    throw new Error('There was a problem retrieving feed data', {
      cause: res.statusText,
    });
  }

  return await res.json();
}
