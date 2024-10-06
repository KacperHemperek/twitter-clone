import { Tweet } from '@/types/Tweet.type';
import { ApiError, ErrorResponse } from '@/types/api/error';
import { PaginatedResponse } from '@/types/api/pagination';

export async function getMainFeedTweets(
  page?: number
): Promise<PaginatedResponse<Tweet>> {
  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/tweets${
    page ? '?page=' + page : ''
  }`;

  const res = await fetch(url, { cache: 'no-cache' });

  const data = await res.json();
  if (!res.ok) {
    throw new ApiError(error, res.status);
  }

  return data;
}

export async function createTweet(tweetBody: string) {
  const res = await fetch('/api/tweets', {
    method: 'POST',
    body: JSON.stringify({ tweetBody }),
  });

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;

    throw new ApiError(error, res.status);
  }
}

export async function likeTweet(tweetId: string) {
  const res = await fetch(`/api/tweets/${tweetId}/like`, { method: 'POST' });

  if (!res.ok) {
    const error = await res.json();

    throw new ApiError(error, res.status);
  }
}

export async function getTweetDetails(
  tweetId: string
): Promise<Tweet | undefined> {
  const url = `${process.env.NEXTAUTH_URL ?? ''}/api/tweets/${tweetId}`;

  const res = await fetch(url, { cache: 'no-cache' });

  if (!res.ok) {
    const error = await res.json();

    throw new ApiError(error, res.status);
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

    throw new ApiError(error, res.status);
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

    throw new ApiError(error, res.status);
  }
}

export async function deleteTweet(tweetId: string) {
  const url = `/api/tweets/${tweetId}`;

  const res = await fetch(url, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;

    throw new ApiError(error, res.status);
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

    throw new ApiError(error, res.status);
  }

  return await res.json();
}

export async function retweet(tweetId: string) {
  const res = await fetch(`/api/tweets/${tweetId}/retweet`, {
    method: 'POST',
  });

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;

    throw new ApiError(error, res.status);
  }
}

export async function editTweet({
  message,
  id,
}: {
  message: string;
  id: string;
}) {
  const res = await fetch(`/api/tweets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;

    throw new ApiError(error, res.status);
  }
}

export async function searchTweets(
  query: string,
  page?: number
): Promise<PaginatedResponse<Tweet>> {
  const params = new URLSearchParams({ query, page: page?.toString() || '1' });

  const res = await fetch(`/api/tweets/search?${params.toString()}`);

  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;

    throw new ApiError(error, res.status);
  }

  return await res.json();
}
