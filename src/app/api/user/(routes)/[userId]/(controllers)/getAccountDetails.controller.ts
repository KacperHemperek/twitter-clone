import { NextRequest, NextResponse } from 'next/server';

import { getAccountDetailsById } from '../(services)/account.service';

import { ServerError, nextServerErrorFactory } from '@/lib/serverError';

export async function getAccountDetailsController(
  req: NextRequest,
  userId: string
) {
  try {
    const accountDetails = await getAccountDetailsById(userId);

    return NextResponse.json({ data: accountDetails });
  } catch (e) {
    if (e instanceof ServerError) {
      return nextServerErrorFactory(e.code, e.message);
    }
    return nextServerErrorFactory(500);
  }
}
