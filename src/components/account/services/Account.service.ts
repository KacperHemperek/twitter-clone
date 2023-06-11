import { Prisma } from '@prisma/client';

import { AccountDetails } from '@/types/AccountDetails.type';

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
  data: Prisma.UserUpdateInput
) {
  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/user/${userId}`;

  const res = await fetch(url, { method: 'PUT', body: JSON.stringify(data) });

  return res.json();
}
