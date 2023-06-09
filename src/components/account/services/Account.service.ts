import { AccountDetails } from '@/types/AccountDetails.type';

export async function getAccoundDetails(
  userId: string
): Promise<AccountDetails> {
  // TODO: get user details from prisma

  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/user/${userId}`;

  const res = await fetch(url);

  const data: { data: AccountDetails } = await res.json();

  console.log({ data });

  if (!res.ok) {
    throw new Error("Couldn't get user information");
  }

  return data.data;
}
