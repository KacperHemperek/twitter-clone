import { resolve } from 'path';

import { Post } from '@/types/Post.type';
import { PaginatedResponse } from '@/types/api/pagination';

export async function getUsersTweets(
  userId: string,
  page?: number
): Promise<PaginatedResponse<Post>> {
  const url = `/api/user/${userId}/tweets${page ? `?page=${page}` : ''}`;

  const res = await fetch(url, { method: 'GET', cache: 'no-cache' });

  if (!res.ok) {
    throw new Error('There was a problem retrieving feed data', {
      cause: res.statusText,
    });
  }

  return await res.json();
}
