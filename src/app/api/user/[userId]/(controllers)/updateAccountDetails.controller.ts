import { AccountParams } from '@/app/api/user/[userId]/tweets/route';
import { authOptions } from '@/utils/next-auth';
import { Prisma } from '@prisma/client';
import Filter from 'bad-words';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { updateAccountDetailsById } from '../(services)/account.service';

import { ThrowProfanityError, nextServerErrorFactory } from '@/lib/server';

const BadWordsFilter = new Filter();

export type UpdateAccountDetailsBody = Pick<
  Prisma.UserUpdateInput,
  'born' | 'description' | 'image' | 'location' | 'name'
>;

export async function updateAccountDetailsControllerHandler(
  req: NextRequest,
  params: AccountParams
) {
  const { userId } = params;

  const session = await getServerSession(authOptions);

  if (!session?.user || userId !== session.user.id) {
    return nextServerErrorFactory(
      403,
      'This user is unauthorized to update account details'
    );
  }

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
}
