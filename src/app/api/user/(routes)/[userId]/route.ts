import { NextRequest } from 'next/server';

import { getAccountDetailsController } from './(controllers)/getAccountDetails.controller';

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
