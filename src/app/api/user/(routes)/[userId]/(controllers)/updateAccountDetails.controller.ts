import { authOptions } from '@/utils/next-auth';
import { getServerSession } from 'next-auth';
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

import { updateAccountDetailsById } from '../(services)/account.service';
import { GET_ACCOUNT_DETAILS_TAGS } from '@/components/account/services/Account.service';

import { ServerError, nextServerErrorFactory } from '@/lib/serverError';

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
    const body: { name?: string } = await req.json();

    const newUser = await updateAccountDetailsById(userId, body);
    revalidateTag(GET_ACCOUNT_DETAILS_TAGS[0]);
    return NextResponse.json({
      message: 'User updated succesfully',
      data: { user: newUser },
    });
  } catch (e) {
    if (e instanceof ServerError) {
      return nextServerErrorFactory(e.code, e.message);
    }
    return nextServerErrorFactory(500);
  }
}
