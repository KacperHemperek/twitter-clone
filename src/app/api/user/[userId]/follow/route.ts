import { follwoUserHandler } from '@/app/api/user/[userId]/follow/(controller)/followUser.controller';
import { AccountParams } from '@/app/api/user/[userId]/tweets/route';
import { NextRequest } from 'next/server';

import { apiHandler } from '@/lib/serverError';

export function POST(req: NextRequest, params: { params: AccountParams }) {
  return apiHandler(follwoUserHandler, req, params);
}
