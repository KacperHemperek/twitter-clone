import { authOptions } from '@/utils/next-auth';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { updateAccountDetailsById } from '../(services)/account.service';
import { GET_ACCOUNT_DETAILS_TAGS } from '@/components/account/services/Account.service';

import { handleServerError, nextServerErrorFactory } from '@/lib/serverError';

export async function updateAccountDetailsControllerHandler(
  req: NextRequest,
  userId: string
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || userId !== session.user.id) {
    return nextServerErrorFactory(
      403,
      'This user is unauthorized to update account details'
    );
  }

  try {
    const body: Prisma.UserUpdateInput = await req.json();

    const updatedUser = await updateAccountDetailsById(userId, body);

    return NextResponse.json({
      message: 'User updated succesfully',
      data: { user: updatedUser },
    });
  } catch (e) {
    return handleServerError(e);
  }
}
