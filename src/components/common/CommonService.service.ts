export async function likeTweet(tweetId: string) {
  const res = await fetch(`/api/tweets/${tweetId}/like`, { method: 'POST' });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(
      error?.message ?? 'Something went wrong while liking tweet'
    );
  }
}
