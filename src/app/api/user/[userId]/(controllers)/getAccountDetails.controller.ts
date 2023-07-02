import { NextRequest, NextResponse } from 'next/server';

import { getAccountDetailsById } from '../(services)/account.service';

import { handleServerError } from '@/lib/serverError';

export async function getAccountDetailsController(
  req: NextRequest,
  userId: string
) {
  try {
    const accountDetails = await getAccountDetailsById(userId);

    return NextResponse.json(accountDetails);
  } catch (e) {
    return handleServerError(e);
  }
}
