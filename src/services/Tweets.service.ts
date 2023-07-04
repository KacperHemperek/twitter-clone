import { Tweet } from '@/types/Tweet.type';
import { PaginatedResponse } from '@/types/api/pagination';

export async function getMainFeedTweets(
  page?: number
): Promise<PaginatedResponse<Tweet>> {
  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/tweets${
    page ? '?page=' + page : ''
  }`;

  const res = await fetch(url, { cache: 'no-cache' });

  if (!res.ok) {
    throw new Error('Error occured while fetching tweets', {
      cause: res.statusText,
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
    const data = await res.json();
    throw new Error(data.message, { cause: res.statusText });
  }
}

export async function likeTweet(tweetId: string) {
  const res = await fetch(`/api/tweets/${tweetId}/like`, { method: 'POST' });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error?.message ?? 'Something went wrong while liking tweet'
    );
  }
}

export async function getTweetDetails(
  tweetId: string
): Promise<Tweet | undefined> {
  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/tweets/${tweetId}`;

  const res = await fetch(url, { cache: 'no-cache' });

  if (!res.ok)
    throw new Error('Error occured while fetching tweet details', {
      cause: res.statusText,
    });

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

  if (!res.ok)
    throw new Error(
      `Error occured while fetching comments for tweet with id: ${tweetId}`,
      {
        cause: res.statusText,
      }
    );
  return await res.json();
}

export async function commentTweet(tweetBody: string, tweetId?: string) {
  const url = `/api/tweets/${tweetId}/comments`;

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ tweetBody }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(
      data?.message ?? 'Something went wrong while commenting on tweet',
      { cause: res.statusText }
    );
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
    const data = await res.json();
    throw new Error(
      data?.message ?? 'Something went wrong while fetching tweets',
      { cause: res.statusText }
    );
  }

  return await res.json();
}

export async function retweet(tweetId: string) {
  const res = await fetch(`/api/tweets/${tweetId}/retweet`, {
    method: 'POST',
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.message ?? 'Something went wrong while retweeting', {
      cause: res.statusText,
    });
  }
}
