'use client';

import { getTweetDetailsQueryKey } from './TweetDetails';
import { Like } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { HeartIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react';
import { uuid } from 'uuidv4';

import { likeTweet } from '@/services/Tweets.service';

import { queryClient } from '@/components/context/Providers';

import { cn } from '@/lib/cn';

import { Tweet } from '@/types/Tweet.type';

export default function LikeButtonDetails({
  tweetId,
  likes,
}: {
  tweetId: string;
  likes: Omit<Like, 'postId'>[];
}) {
  const { data: session } = useSession();
  // FIXME: Upadte likes on home feed
  const { mutate: likeTweetMutation } = useMutation({
    mutationFn: async () => likeTweet(tweetId),
    onMutate: async () => {
      const tweet = queryClient.getQueryData<Tweet>(tweetDetailsQueryKeys);

      const userId = session?.user.id;

      if (!tweet || !userId) {
        return { tweet };
      }

      const isLiked = tweet.likes.some((like) => like.userId === userId);

      const updatedTweet: Tweet = isLiked
        ? {
            ...tweet,
            likes: tweet.likes.filter((like) => like.userId !== userId),
          }
        : {
            ...tweet,
            likes: [...tweet.likes, { userId, id: uuid() }],
          };

      queryClient.setQueryData(tweetDetailsQueryKeys, updatedTweet);

      return { tweet };
    },

    onError: (_error, _vars, context) => {
      if (context?.tweet) {
        queryClient.setQueryData(tweetDetailsQueryKeys, context.tweet);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mainTweets']);
      queryClient.invalidateQueries(tweetDetailsQueryKeys);
    },
  });

  const tweetDetailsQueryKeys = getTweetDetailsQueryKey(tweetId);

  const tweetIsLiked = likes.some((like) => like.userId === session?.user.id);

  return (
    <button
      onClick={() => likeTweetMutation()}
      className={cn(
        tweetIsLiked && 'text-pink-600',
        'transition-all hover:text-pink-400'
      )}
    >
      <HeartIcon className="h-5 w-5" />
    </button>
  );
}
