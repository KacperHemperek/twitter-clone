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

export function getUpdatedFeedWithNewRetweet(
  data: InfiniteQueryData<Tweet>,
  tweetToUpdate: Tweet,
  tweetIsRetweeted: boolean,
  userId: string
) {
  const queryData = data.pages.map((page) => {
    const updatedPageData = page.data.map((tweet): Tweet => {
      if (tweet.id !== tweetToUpdate.id) {
        return tweet;
      }

      let retweets: {
        id: string;
        userId: string;
        postId: string;
      }[];

      if (tweetIsRetweeted) {
        retweets = tweet.retweets.filter(
          (retweet) => retweet.userId !== userId
        );
      } else {
        retweets = [
          ...tweet.retweets,
          {
            id: uuid(),
            postId: tweetToUpdate.id,
            userId,
          },
        ];
      }

      return { ...tweet, retweets };
    });

    return { ...page, data: updatedPageData };
  });

  return queryData;
}
