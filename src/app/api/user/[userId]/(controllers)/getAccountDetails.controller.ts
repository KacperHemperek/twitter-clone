import { AccountParams } from '@/app/api/user/[userId]/tweets/route';
import { NextRequest, NextResponse } from 'next/server';

import { AccountService } from '@/server/services/account.service';

export async function getAccountDetailsController(
  req: NextRequest,
  params: AccountParams
) {
  const { userId } = params;

  const accountDetails = await AccountService.getDetailsById(userId)

  return NextResponse.json(accountDetails);
}
