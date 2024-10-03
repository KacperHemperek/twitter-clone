import { Prisma } from '@prisma/client';

import { ServerError } from '@/lib/server';

import { prisma } from '@/db/prisma';

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
