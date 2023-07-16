import { Tweet } from '@/types/Tweet.type';
import { ErrorResponse } from '@/types/api/error';
import { PaginatedResponse } from '@/types/api/pagination';

export async function getMainFeedTweets(
  page?: number
): Promise<PaginatedResponse<Tweet>> {
  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/tweets${
    page ? '?page=' + page : ''
  }`;

  const res = await fetch(url, { cache: 'no-cache' });

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;

    throw new Error(error.message, {
      cause: {
        status: res.status,
        cause: error.cause,
      },
    });
  }

  const tweets = await res.json();

  return tweets;
}

export async function createTweet(tweetBody: string) {
  const res = await fetch('/api/tweets', {
    method: 'POST',
    body: JSON.stringify({ tweetBody }),
  });

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;

    throw new Error(error.message, {
      cause: {
        status: res.status,
        cause: error.cause,
      },
    });
  }
}

export async function likeTweet(tweetId: string) {
  const res = await fetch(`/api/tweets/${tweetId}/like`, { method: 'POST' });

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;

    throw new Error(error.message, {
      cause: {
        status: res.status,
        cause: error.cause,
      },
    });
  }
}

export async function getTweetDetails(
  tweetId: string
): Promise<Tweet | undefined> {
  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/tweets/${tweetId}`;

  const res = await fetch(url, { cache: 'no-cache' });

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;

    throw new Error(error.message, {
      cause: {
        status: res.status,
        cause: error.cause,
      },
    });
  }

  const tweetDetails = await res.json();

  return tweetDetails;
}

export async function getComments(
  pageParam: number,
  tweetId: string
): Promise<PaginatedResponse<Tweet>> {
  const url = `/api/tweets/${tweetId}/comments?${
    pageParam ? `page=${pageParam}` : ''
  }`;

  const res = await fetch(url);

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;

    throw new Error(error.message, {
      cause: {
        status: res.status,
        cause: error.cause,
      },
    });
  }
  return await res.json();
}

export async function commentTweet(tweetBody: string, tweetId?: string) {
  const url = `/api/tweets/${tweetId}/comments`;

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ tweetBody }),
  });

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;

    throw new Error(error.message, {
      cause: {
        status: res.status,
        cause: error.cause,
      },
    });
  }
}

export async function getTweetsFromFollowedUsers(
  nextPage?: number
): Promise<PaginatedResponse<Tweet>> {
  const res = await fetch(
    `/api/tweets/followed${nextPage ? `?page=${nextPage}` : ''}`,
    { method: 'GET', cache: 'no-cache' }
  );

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;

    throw new Error(error.message, {
      cause: {
        status: res.status,
        cause: error.cause,
      },
    });
  }

  return await res.json();
}

export async function retweet(tweetId: string) {
  const res = await fetch(`/api/tweets/${tweetId}/retweet`, {
    method: 'POST',
  });

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;

    throw new Error(error.message, {
      cause: {
        status: res.status,
        cause: error.cause,
      },
    });
  }
}
