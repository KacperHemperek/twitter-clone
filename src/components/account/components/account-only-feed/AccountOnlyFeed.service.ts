import { resolve } from 'path';

import { Post } from '@/types/Post.type';
import { PaginatedResponse } from '@/types/api/pagination';

export async function getUsersTweets(
  userId: string,
  page?: number
): Promise<PaginatedResponse<Post>> {
  return {
    data: [],
    nextPage: undefined,
  };
}
