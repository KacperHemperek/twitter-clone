import { uuid } from 'uuidv4';

import { Tweet } from '@/types/Tweet.type';
import { PaginatedResponse } from '@/types/api/pagination';

export type InfiniteQueryData<T> = {
  pages: PaginatedResponse<T>[];
  pageParams: string[] | number[];
};

export function reduceDataFromInfiniteQuery<T>(
  data: InfiniteQueryData<T>
): T[] {
  return data.pages
    .map((item) => item.data)
    .reduce((acc, curr) => [...acc, ...curr], []);
}

export function getUpdatedFeedWithNewLike(
  data: InfiniteQueryData<Tweet>,
  tweetToUpdate: Tweet,
  tweetIsLiked: boolean,
  userId: string
): InfiniteQueryData<Tweet> {
  return {
    pages: data.pages.map((page) => {
      return {
        data: page.data.map((tweetFromCache) =>
          tweetFromCache.id !== tweetToUpdate.id
            ? tweetFromCache
            : {
                ...tweetFromCache,
                likes: tweetIsLiked
                  ? tweetFromCache.likes.filter(
                      (like) => like.userId !== userId
                    )
                  : [
                      ...tweetFromCache.likes,
                      {
                        id: uuid(),
                        postId: tweetFromCache.id,
                        userId: userId,
                      },
                    ],
              }
        ),
        nextPage: page?.nextPage,
      };
    }),
    pageParams: data.pageParams,
  };
}
