import { authOptions } from '@/utils/next-auth';
import { Prisma } from '@prisma/client';
import Filter from 'bad-words';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { updateAccountDetailsById } from '../(services)/account.service';

import {
  ThrowProfanityError,
  handleServerError,
  nextServerErrorFactory,
} from '@/lib/serverError';

const BadWordsFilter = new Filter();

export type UpdateAccountDetailsBody = Pick<
  Prisma.UserUpdateInput,
  'born' | 'description' | 'image' | 'location' | 'name'
>;

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
    const body: UpdateAccountDetailsBody = await req.json();

    if (
      Object.values(body).some(
        (value) => typeof value === 'string' && BadWordsFilter.isProfane(value)
      )
    ) {
      ThrowProfanityError();
    }

    const updatedUser = await updateAccountDetailsById(userId, body);

    return NextResponse.json({
      message: 'User updated succesfully',
      data: { user: updatedUser },
    });
  } catch (e) {
    return handleServerError(e);
  }
}
