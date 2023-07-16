import { NextRequest } from 'next/server';

import { getAccountDetailsController } from './(controllers)/getAccountDetails.controller';
import { updateAccountDetailsControllerHandler } from './(controllers)/updateAccountDetails.controller';

import { apiHandler } from '@/lib/serverError';

type AccountParams = {
  userId: string;
};

export function GET(
  req: NextRequest,
  params: {
    params: AccountParams;
  }
) {
  return apiHandler(getAccountDetailsController, req, params);
}

export function PUT(req: NextRequest, params: { params: AccountParams }) {
  return apiHandler(updateAccountDetailsControllerHandler, req, params);
}
