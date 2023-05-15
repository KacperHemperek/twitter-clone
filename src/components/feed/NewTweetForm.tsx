'use client';

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSession } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../Providers';
import { cn } from '@/lib/cn';
import { InfiniteQueryData } from '@/lib/infiniteQueryHelpers';
import { Post } from '@/types/Post.type';
import { Oval } from 'react-loader-spinner';
import { useToast } from '../ui/use-toast';

export default function NewTweetForm({
  feedQueryKey,
}: {
  feedQueryKey: string[];
}) {
  const { toast } = useToast();

  const { mutate: postTweet, isLoading } = useMutation({
    mutationFn: async () =>
      fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ tweetBody: newTweet }),
      }).then((res) => res.json()),

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
      toast({
        variant: 'destructive',
        title: 'Oh no! something went wrong while sending you tweet.',
        description: 'You can try that again1!',
      });
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
            className={cn(
              isLoading ? 'w-14' : 'w-20',
              'flex items-center justify-center rounded-full bg-sky-500 py-1.5 font-bold transition-all duration-300 disabled:bg-gray-400 '
            )}
            disabled={!tweetButtonNotDisabled || isLoading}
            onClick={() => postTweet()}
          >
            {isLoading ? (
              <Oval
                width={18}
                height={18}
                color='white'
                visible={true}
                ariaLabel='oval-loading'
                secondaryColor='white'
                strokeWidth={6}
                strokeWidthSecondary={6}
              />
            ) : (
              <span>Tweet</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
