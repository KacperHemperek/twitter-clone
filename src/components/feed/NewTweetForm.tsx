'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSession } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../Providers';
import { cn } from '@/lib/cn';
import { InfiniteQueryData } from '@/lib/infiniteQueryHelpers';
import { Post } from '@/types/Post.type';

export default function NewTweetForm({
  feedQueryKey,
}: {
  feedQueryKey: string[];
}) {
  const { mutate: postTweet, isLoading } = useMutation({
    mutationFn: async () =>
      fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ tweetBody: newTweet }),
      }),
    onMutate: () => {
      queryClient.setQueryData(
        feedQueryKey,
        (old?: InfiniteQueryData<Post>) => {
          if (old) {
            return {
              pages: [old.pages[0]],
              pageParams: ['1'],
            };
          }
        }
      );
    },

    onError: (e) => {
      //TODO: show toast when there is an error
      console.error({ e });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(feedQueryKey);
      setNewTweet('');
    },
  });

  const { data: session } = useSession();

  const [newTweet, setNewTweet] = useState('');

  const tweetButtonNotDisabled =
    newTweet.trim().length <= 256 && newTweet.trim().length > 0;

  return (
    <div className='flex space-x-3 border-b border-gray-600 p-4'>
      <Avatar>
        <AvatarImage src={session?.user.image ?? undefined} />
        <AvatarFallback>{session?.user.name?.[0] ?? ''}</AvatarFallback>
      </Avatar>
      <div className='flex flex-grow flex-col'>
        <textarea
          value={newTweet}
          onChange={(e) => setNewTweet(e.target.value)}
          rows={3}
          placeholder='What is happening?!'
          className={cn(
            isLoading && 'text-gray-600',
            'resize-x-none mb-4 flex-grow overscroll-contain border-b border-gray-600 bg-transparent text-xl outline-none transition-colors placeholder:text-gray-600'
          )}
        />
        <div className='flex items-center space-x-4 self-end'>
          <p className='text-sm text-gray-600'>
            {newTweet.trim().length} / 255
          </p>
          <button
            className='max-w-fit rounded-full bg-sky-500 px-5 py-1.5 font-bold transition-colors disabled:bg-gray-400'
            disabled={!tweetButtonNotDisabled || isLoading}
            onClick={() => postTweet()}
          >
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
}
