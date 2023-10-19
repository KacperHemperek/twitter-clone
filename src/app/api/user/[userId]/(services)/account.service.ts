import { Prisma } from '@prisma/client';

import { ServerError } from '@/lib/server';

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
        followers: {
          select: { id: true },
        },
        following: {
          select: { id: true },
        },
      },
    });

    if (!accountDetails) {
      throw new ServerError({
        code: 404,
        message: "Couldn't find user with id: " + userId,
      });
    }

    const formatedAccountDetails: AccountDetails = {
      ...accountDetails,
      followers: accountDetails.followers.map((follower) => follower.id),
      following: accountDetails.following.map((following) => following.id),
    };

    return formatedAccountDetails;
  } catch (e) {
    throw new ServerError({
      code: 404,
      message: "Couldn't find user with id: " + userId,
    });
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
    throw new ServerError({
      code: 500,
      message: "Couldn't update users profile",
    });
  }
}
