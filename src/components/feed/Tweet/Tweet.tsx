'use client';
import { type Post } from '@/types/Post.type';
import React, { memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { formatNumberToCompact } from '@/lib/shortNumberFormatter';
import { HeartIcon, MessageCircleIcon, RefreshCwIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/cn';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../context/Providers';
import {
  InfiniteQueryData,
  getUpdatedFeedWithNewLike,
} from '@/lib/infiniteQueryHelpers';
import { useRouter } from 'next/navigation';
import TweetUserInfo from '@/components/common/TweetUserInfo';

function Tweet({ post, feedQueryKey }: { post: Post; feedQueryKey: string[] }) {
  const router = useRouter();
  const { data: session } = useSession();

  const { mutate: likeTweet } = useMutation({
    mutationFn: async () =>
      fetch(`/api/posts/${post.id}/like`, { method: 'POST' }).then((res) =>
        res.json()
      ),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: feedQueryKey });

      const feed =
        queryClient.getQueryData<InfiniteQueryData<Post>>(feedQueryKey);

      if (!feed || !session?.user.id) {
        return { feed };
      }

      const updatedFeed = getUpdatedFeedWithNewLike(
        feed,
        post,
        tweetIsLiked,
        session.user.id
      );

      queryClient.setQueryData(feedQueryKey, updatedFeed);

      return { feed };
    },

    onError: (_error, _vars, context) => {
      if (context?.feed) {
        queryClient.setQueryData(feedQueryKey, context.feed);
      }
    },
  });

  const onLikeTweet = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeTweet();
  };

  const goToTweetDetails = () => {
    router.push(`/tweet/${post.id}`);
  };

  const tweetIsLiked = post.likes.some(
    (like) => like.userId === session?.user.id
  );

  const tweetIsRetweeted = false;

  return (
    <div
      onClick={goToTweetDetails}
      className='flex cursor-pointer space-x-3 border-b border-gray-700 p-4 text-sm'
    >
      <Avatar className='z-0 h-10 w-10'>
        <AvatarImage src={post.author.image ?? undefined} />
        <AvatarFallback className='text-white'>
          {post.author.name?.[0] ?? 'A'}
        </AvatarFallback>
      </Avatar>
      <div className='flex-grow space-y-2'>
        <TweetUserInfo
          authorEmail={post.author.email}
          authorName={post.author.name}
          createdAt={post.createdAt}
        />

        <p className=''>{post.message}</p>
        <div className='grid grid-cols-3'>
          <div>
            <button
              className={cn(
                tweetIsLiked ? 'text-pink-600' : 'text-gray-400',
                'group flex cursor-pointer items-center transition-all hover:text-pink-400'
              )}
              onClick={onLikeTweet}
            >
              <HeartIcon className='mr-4  h-4 w-4' />
              {formatNumberToCompact(post.likes.length)}
            </button>
          </div>
          <div>
            <button
              className={cn(
                tweetIsRetweeted ? 'text-green-500' : 'text-gray-400',
                'group flex cursor-pointer items-center transition-all hover:text-green-400'
              )}
            >
              <RefreshCwIcon className='mr-4  h-4 w-4' />
              {formatNumberToCompact(13)}
            </button>
          </div>
          <div>
            <button
              className={
                'group flex cursor-pointer items-center text-gray-400 transition-all hover:text-sky-500'
              }
            >
              <MessageCircleIcon className='mr-4  h-4 w-4' />
              {formatNumberToCompact(post.comments?.length ?? 0)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Tweet);
