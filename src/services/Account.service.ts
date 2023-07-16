import { Prisma } from '@prisma/client';

import { UpdateAccountDetailsBody } from '@/app/api/user/[userId]/(controllers)/updateAccountDetails.controller';

import { AccountDetails } from '@/types/AccountDetails.type';
import { Tweet } from '@/types/Tweet.type';
import { ErrorResponse } from '@/types/api/error';
import { PaginatedResponse } from '@/types/api/pagination';

export const GET_ACCOUNT_DETAILS_TAGS = ['accountDetails'];

export async function getAccountDetails(
  userId: string
): Promise<AccountDetails> {
  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/user/${userId}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
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
}

export async function updateAccountDetails(
  userId: string,
  data: UpdateAccountDetailsBody
) {
  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/user/${userId}`;

  const res = await fetch(url, { method: 'PUT', body: JSON.stringify(data) });

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;
    throw new Error(error.message, {
      cause: {
        status: res.status,
        cause: error.cause,
      },
    });
  }
}

export async function getUsersTweets(
  userId: string,
  page?: number
): Promise<PaginatedResponse<Tweet>> {
  const url = `/api/user/${userId}/tweets${page ? `?page=${page}` : ''}`;

  const res = await fetch(url, { method: 'GET', cache: 'no-cache' });

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
}

export async function getUsersLikedTweets(
  userId: string,
  page?: number
): Promise<PaginatedResponse<Tweet>> {
  const url = `/api/user/${userId}/likes${page ? `?page=${page}` : ''}`;

  const res = await fetch(url, { method: 'GET', cache: 'no-cache' });

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
}

export async function followUser(userId: string) {
  const url = `/api/user/${userId}/follow`;

  const res = await fetch(url, { method: 'POST' });

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;
    throw new Error(error.message, {
      cause: {
        status: res.status,
        cause: error.cause,
      },
    });
  }
}
