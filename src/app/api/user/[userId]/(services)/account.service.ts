import { Prisma } from '@prisma/client';

import { ServerError } from '@/lib/serverError';

import { AccountDetails } from '@/types/AccountDetails.type';

import { prisma } from '@/db/prisma';

export async function getAccountDetailsById(
  userId: string
): Promise<AccountDetails> {
  try {
    const accountDetails = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        born: true,
        description: true,
        emailVerified: true,
        email: true,
        id: true,
        location: true,
        image: true,
        _count: { select: { followers: true, following: true } },
      },
    });

    if (!accountDetails) {
      throw new ServerError(404, "Couldn't find user with id: " + userId);
    }

    const formatedAccountDetails: AccountDetails = {
      ...accountDetails,
      followersCount: accountDetails._count.followers,
      followingCount: accountDetails._count.following,
    };

    return formatedAccountDetails;
  } catch (e) {
    throw new ServerError(404, "Couldn't find user with id: " + userId);
  }
}

export async function updateAccountDetailsById(
  userId: string,
  data: Prisma.UserUpdateInput
) {
  try {
    const newUser = await prisma.user.update({ where: { id: userId }, data });

    return newUser;
  } catch (e) {
    throw new ServerError(500, "Couldn't update users profile");
  }
}
