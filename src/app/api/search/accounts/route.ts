import { NextRequest } from 'next/server';

import { searchAccountsController } from '@/app/api/search/accounts/(controllers)/searchAccounts.controller';

import { apiHandler } from '@/lib/server';

export function GET(req: NextRequest) {
  return apiHandler(searchAccountsController, req);
}
