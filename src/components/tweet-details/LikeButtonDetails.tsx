'use client';

import { getTweetDetailsQueryKey } from './TweetDetails';
import { MAIN_FEED_QUERY_KEYS } from '@/app/feed/main/(components)/MainFeed';
import { Like } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { HeartIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react';
import { uuid } from 'uuidv4';

import { likeTweet } from '@/services/Tweets.service';

import LoginDialog from '@/components/common/LoginDialog';
import { queryClient } from '@/components/context/Providers';
import { toast } from '@/components/ui/use-toast';

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
  const { mutate: likeTweetMutation, isLoading } = useMutation({
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

    onError: (error: any, _vars, context) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description:
          error?.cause ??
          `We couldn't like this tweet. Please try again later.`,
      });
      if (context?.tweet) {
        queryClient.setQueryData(tweetDetailsQueryKeys, context.tweet);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(MAIN_FEED_QUERY_KEYS);
    },
  });

  if (!session)
    return (
      <LoginDialog
        trigger={
          <button className="transition-all hover:text-pink-400">
            <HeartIcon className="h-5 w-5" />
          </button>
        }
      />
    );

  const tweetDetailsQueryKeys = getTweetDetailsQueryKey(tweetId);

  const tweetIsLiked = likes.some((like) => like.userId === session?.user.id);

  return (
    <button
      onClick={() => likeTweetMutation()}
      disabled={isLoading}
      className={cn(
        tweetIsLiked && 'text-pink-600',
        'transition-all hover:text-pink-400'
      )}
    >
      <HeartIcon className="h-5 w-5" />
    </button>
  );
}
