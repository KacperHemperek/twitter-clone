import { AccountParams } from '@/app/api/user/[userId]/tweets/route';

import { AccountService } from '@/server/services/account.service';
import { FollowerService } from '@/server/services/follower.service';

import { AccountDetails } from '@/types/AccountDetails.type';

import { NextRequest, NextResponse } from 'next/server';

export async function getAccountDetailsController(
  _: NextRequest,
  params: AccountParams
) {
  const { userId } = params;

  const accountDetails = await AccountService.getDetailsById(userId);

  const followers = await FollowerService.getUserFollowerIds(userId);

  return NextResponse.json({
    ...accountDetails,
    followers,
  } satisfies AccountDetails);
}
