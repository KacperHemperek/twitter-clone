export async function likeTweet(tweetId: string) {
  const res = await fetch(`/api/tweets/${tweetId}/like`, { method: 'POST' });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error?.message ?? 'Something went wrong while liking tweet'
    );
  }
}

export async function commentTweet(tweetBody: string, tweetId: string) {
  const url = `/api/tweets/${tweetId}/comments`;

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ tweetBody }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(
      data?.message ?? 'Something went wrong while commenting on tweet'
    );
  }
}
