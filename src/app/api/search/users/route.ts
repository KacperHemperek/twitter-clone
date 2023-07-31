import { searchAccountsController } from '@/app/api/search/users/(controller)/searchAccounts.controller';
import { NextRequest } from 'next/server';

import { apiHandler } from '@/lib/serverError';

export const GET = (req: NextRequest) =>
  apiHandler(searchAccountsController, req);
