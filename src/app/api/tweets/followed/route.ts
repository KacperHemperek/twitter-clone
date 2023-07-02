import { getTweetsFromFollowedUsersHandler } from '@/app/api/tweets/followed/(controller)/getTweetsFromFollowedUsers.controller';
import { NextRequest } from 'next/server';

export function GET(req: NextRequest) {
  return getTweetsFromFollowedUsersHandler(req);
}
