import omit from 'lodash/omit';

import { ServerError } from '@/lib/serverError';

import { prisma } from '@/db/prisma';

export async function getAccountDetailsById(userId: string) {
  try {
    const accountDetails = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        born: true,
        description: true,
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

    const formatedAccountDetails = omit(
      {
        ...accountDetails,
        followersCount: accountDetails._count.followers,
        followingCount: accountDetails._count.following,
      },
      ['_count']
    );

    return formatedAccountDetails;
  } catch (e) {
    throw new ServerError(404, "Couldn't find user with id: " + userId);
  }
}
