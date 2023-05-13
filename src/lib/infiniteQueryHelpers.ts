import { Post } from '@/types/Post.type';
import { PaginatedResponse } from '@/types/api/pagination';
import { uuid } from 'uuidv4';

export type InfiniteQueryData<T> = {
  pages: PaginatedResponse<T>[];
  pageParams: string[];
};

export function reduceDataFromInfiniteQuery<T>(
  data: InfiniteQueryData<T>
): T[] {
  return data.pages
    .map((item) => item.data)
    .reduce((acc, curr) => [...acc, ...curr], []);
}

export function getUpdatedFeedWithNewLike(
  data: InfiniteQueryData<Post>,
  tweetToUpdate: Post,
  tweetIsLiked: boolean,
  userId: string
): InfiniteQueryData<Post> {
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
