'use client';

import { getTweetDetailsQueryKey } from './TweetDetails';
import { Like } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { HeartIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react';
import { uuid } from 'uuidv4';

import { queryClient } from '../../context/Providers';

import { cn } from '@/lib/cn';

import { Post } from '@/types/Post.type';

export default function LikeButtonDetails({
  tweetId,
  likes,
}: {
  tweetId: string;
  likes: Like[];
}) {
  const { data: session } = useSession();
  // FIXME: Upadte likes on home feed
  const { mutate: likeTweet } = useMutation({
    mutationFn: async () =>
      fetch(`/api/tweets/${tweetId}/like`, { method: 'POST' }).then((res) =>
        res.json()
      ),
    onMutate: async () => {
      const tweet = queryClient.getQueryData<Post>(tweetDetailsQueryKeys);

      const userId = session?.user.id;

      if (!tweet || !userId) {
        return { tweet };
      }

      const isLiked = tweet.likes.some((like) => like.userId === userId);

      const updatedTweet: Post = isLiked
        ? {
            ...tweet,
            likes: tweet.likes.filter((like) => like.userId !== userId),
          }
        : {
            ...tweet,
            likes: [...tweet.likes, { userId, id: uuid(), postId: tweet.id }],
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
      onClick={() => likeTweet()}
      className={cn(
        tweetIsLiked && 'text-pink-600',
        'transition-all hover:text-pink-400'
      )}
    >
      <HeartIcon className="h-5 w-5" />
    </button>
  );
}
