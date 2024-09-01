import { MAIN_FEED_QUERY_KEYS } from '@/app/feed/main/(components)/MainFeed';
import { retweet } from '@/clients/tweets.client';
import { Retweet } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import { RefreshCwIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react';
import { uuid } from 'uuidv4';

import LoginDialog from '@/components/common/LoginDialog';
import { queryClient } from '@/components/context/Providers';
import { getTweetDetailsQueryKey } from '@/components/tweet-details/TweetDetails';
import { toast } from '@/components/ui/use-toast';

import { cn } from '@/lib/cn';

import { Tweet } from '@/types/Tweet.type';

export function RetweetButtonDetails({
  id,
  retweets,
}: {
  id: string;
  retweets: Omit<Retweet, 'postId' | 'retweetedAt'>[];
}) {
  const { data: session } = useSession();

  const { mutate: retweetMutation, isLoading } = useMutation({
    mutationFn: async () => retweet(id),
    onMutate: async () => {
      const queryKey = getTweetDetailsQueryKey(id);

      const tweet = queryClient.getQueryData<Tweet>(queryKey);

      const userId = session?.user.id;

      if (!tweet || !userId) {
        return { tweet };
      }

      const isRetweeted = retweets.some((like) => like.userId === userId);

      const updatedTweet: Tweet = isRetweeted
        ? {
            ...tweet,
            retweets: tweet.retweets.filter((like) => like.userId !== userId),
          }
        : {
            ...tweet,
            retweets: [...tweet.retweets, { userId, id: uuid() }],
          };

      queryClient.setQueryData(queryKey, updatedTweet);

      return { tweet };
    },
    onError: (error: any, _vars, context) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description:
          error?.cause ??
          `We couldn't retweet this tweet. Please try again later.`,
      });
      if (context?.tweet) {
        queryClient.setQueryData(getTweetDetailsQueryKey(id), context.tweet);
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
          <button className="cursor-pointer transition-all hover:text-green-400">
            <RefreshCwIcon className="h-5 w-5" />
          </button>
        }
      />
    );

  const tweetIsRetweeted = retweets.some(
    (retweet) => retweet.userId === session?.user.id
  );

  return (
    <button
      onClick={() => retweetMutation()}
      disabled={isLoading}
      className={cn(
        tweetIsRetweeted && 'text-green-600',
        'cursor-pointer transition-all hover:text-green-400'
      )}
    >
      <RefreshCwIcon className="h-5 w-5" />
    </button>
  );
}
