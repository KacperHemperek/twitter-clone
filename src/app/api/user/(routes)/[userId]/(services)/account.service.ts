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
        followers: { select: { _count: true } },
        following: { select: { _count: true } },
      },
    });

    if (!accountDetails) {
      throw new ServerError(404, "Couldn't find user with id: " + userId);
    }

    return accountDetails;
  } catch (e) {
    throw new ServerError(404, "Couldn't find user with id: " + userId);
  }
}
