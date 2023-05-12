'use client';
import { type Post } from '@/types/Post.type';
import React, { memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatTweetDate } from '@/lib/timeAgo';
import { formatNumberToCompact } from '@/lib/shortNumberFormatter';
import { HeartIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/cn';

function Tweet({ post }: { post: Post }) {
  const { data: session } = useSession();
  const userLikedTweet = post.likes.some(
    (like) => like.userId === session?.user.id
  );

  return (
    <div className='flex space-x-3 border-b border-gray-700 p-3 text-sm'>
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
          <button
            className={cn(
              userLikedTweet ? 'text-pink-600' : 'text-gray-400',
              'flex cursor-pointer items-center'
            )}
          >
            <HeartIcon className='mr-2 h-4 w-4' />
            {formatNumberToCompact(post.likes.length)}
          </button>
          <div>lol</div>
          <div>lol</div>
        </div>
      </div>
    </div>
  );
}

export default memo(Tweet);
