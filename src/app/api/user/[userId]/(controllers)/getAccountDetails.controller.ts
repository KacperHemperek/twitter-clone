import { AccountParams } from '@/app/api/user/[userId]/tweets/route';
import { NextRequest, NextResponse } from 'next/server';

import { getAccountDetailsById } from '../(services)/account.service';

export async function getAccountDetailsController(
  req: NextRequest,
  params: AccountParams
) {
  const { userId } = params;

  const accountDetails = await getAccountDetailsById(userId);

  return NextResponse.json(accountDetails);
}
