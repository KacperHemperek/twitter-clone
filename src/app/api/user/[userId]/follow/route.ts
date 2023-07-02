import { follwoUserHandler } from '@/app/api/user/[userId]/follow/(controller)/followUser.controller';
import { NextRequest } from 'next/server';

export function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  return follwoUserHandler(req, params.userId);
}
