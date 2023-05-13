'use client';
import { type Post } from '@/types/Post.type';
import React, { memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatTweetDate } from '@/lib/timeAgo';
import { formatNumberToCompact } from '@/lib/shortNumberFormatter';
import { HeartIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/cn';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../Providers';
import {
  InfiniteQueryData,
  getUpdatedFeedWithNewLike,
} from '@/lib/infiniteQueryHelpers';

function Tweet({ post, feedQueryKey }: { post: Post; feedQueryKey: string[] }) {
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

    onError: (error, _, context) => {
      if (context?.feed) {
        queryClient.setQueryData(feedQueryKey, context.feed);
      }
    },
  });

  const tweetIsLiked = post.likes.some(
    (like) => like.userId === session?.user.id
  );

  return (
    <div className='flex space-x-3 border-b border-gray-700 p-4 text-sm'>
      <Avatar className='z-0 h-10 w-10'>
        <AvatarImage src={post.author.image ?? undefined} />
        <AvatarFallback className='text-white'>
          {post.author.name?.[0] ?? 'A'}
        </AvatarFallback>
      </Avatar>
      <div className='flex-grow space-y-1'>
        <div className='flex items-center space-x-1'>
          <h5 className='font-bold'>{post.author.name} </h5>
          <span className='text-gray-400'>{`@${post.author.email}`}</span>
          <span className='text-gray-400'>·</span>
          <span className='text-gray-400'>
            {formatTweetDate(new Date(post.createdAt))}
          </span>
        </div>
        <p className=''>{post.message}</p>
        <div className='grid grid-cols-3'>
          <div>
            <button
              className={cn(
                tweetIsLiked ? 'text-pink-600' : 'text-gray-400',
                'group flex cursor-pointer items-center'
              )}
              onClick={() => likeTweet()}
            >
              <HeartIcon className='mr-4  h-4 w-4' />
              {formatNumberToCompact(post.likes.length)}
            </button>
          </div>
          <div>lol</div>
          <div>lol</div>
        </div>
      </div>
    </div>
  );
}

export default memo(Tweet);
