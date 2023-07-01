import { NextRequest } from 'next/server';

import { getAccountDetailsController } from './(controllers)/getAccountDetails.controller';
import { updateAccountDetailsControllerHandler } from './(controllers)/updateAccountDetails.controller';

type AccountParams = {
  userId: string;
};

export function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: AccountParams;
  }
) {
  return getAccountDetailsController(req, params.userId);
}

export function PUT(req: NextRequest, { params }: { params: AccountParams }) {
  return updateAccountDetailsControllerHandler(req, params.userId);
}
