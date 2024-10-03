import { AccountParams } from '@/app/api/user/[userId]/tweets/route';

import { AccountService } from '@/server/services/account.service';
import { FollowService } from '@/server/services/follow.service';

import { AccountDetails } from '@/types/AccountDetails.type';

import { NextRequest, NextResponse } from 'next/server';

export async function getAccountDetailsController(
  _: NextRequest,
  params: AccountParams
) {
  const { userId } = params;

  const accountDetails = await AccountService.getDetailsById(userId);

  const followers = await FollowService.getUserFollowerIds(userId);
  const followees = await FollowService.getUserFolloweeIds(userId);

  return NextResponse.json({
    ...accountDetails,
    followers,
    following: followees,
  } satisfies AccountDetails);
}
