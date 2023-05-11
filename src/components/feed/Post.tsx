import { Post } from '@/types/Post.type';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { formatTweetDate } from '@/lib/timeAgo';
import { formatNumberToCompact } from '@/lib/shortNumberFormatter';

export default function Post({ post }: { post: Post }) {
  return (
    <div className='flex space-x-3 border-b border-gray-700 p-6'>
      <Avatar>
        <AvatarImage src={post.author.image ?? undefined} />
        <AvatarFallback className='text-white'>
          {post.author.name?.[0] ?? 'A'}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className='flex items-center space-x-2'>
          <h5>{post.author.name} </h5>
          <span className='text-sm text-gray-500'>{`@${post.author.email}`}</span>
          <span className='text-sm text-gray-500'>·</span>
          <span className='text-sm text-gray-500'>
            {formatTweetDate(new Date(post.createdAt))}
          </span>
        </div>
        <p>{post.message}</p>
        <button>{formatNumberToCompact(post.likes.length)}</button>
      </div>
    </div>
  );
}
