'use client';

import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { Oval } from 'react-loader-spinner';

import { queryClient } from '../../context/Providers';
import TweetAvatar from '../../feed/TweetAvatar';
import { useToast } from '../../ui/use-toast';

import { cn } from '@/lib/cn';
import { InfiniteQueryData } from '@/lib/infiniteQueryHelpers';

import { Tweet } from '@/types/Tweet.type';

type NewTweetFormProps = {
  feedQueryKey: string[];
  createTweet: (tweetBody: string, tweetId?: string) => Promise<void>;
  onSuccessCallback?: () => void;
  wrapperClassname?: string;
  /*
   * this is required when you want to add a reply to a
   * tweet instead of a new tweet
   */
  tweetId?: string;
  placeholder?: string;
};

export default function NewTweetForm({
  feedQueryKey,
  createTweet,
  tweetId,
  onSuccessCallback,
  wrapperClassname = '',
  placeholder = 'What is happening?!',
}: NewTweetFormProps) {
  const { toast } = useToast();

  const { mutate: postTweet, isLoading } = useMutation({
    mutationFn: async () => await createTweet(newTweet, tweetId),
    onMutate: () => {
      queryClient.setQueryData(
        feedQueryKey,
        (old?: InfiniteQueryData<Tweet>) => {
          if (old) {
            return {
              pages: [old.pages[0]],
              pageParams: ['1'],
            };
          }
        }
      );
    },
    onError: (e: any) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description:
          e?.message ?? 'Something went wrong while sending you tweet.',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(feedQueryKey);
      setNewTweet('');
      onSuccessCallback && onSuccessCallback();
    },
  });

  const { data: session } = useSession();

  const [newTweet, setNewTweet] = useState('');

  const tweetButtonNotDisabled =
    newTweet.trim().length <= 256 && newTweet.trim().length > 0;

  return (
    <div
      className={cn(
        'flex space-x-3 p-4 border-b border-gray-600',
        wrapperClassname
      )}
    >
      <TweetAvatar
        image={session?.user.image ?? null}
        authorName={session?.user.name ?? null}
        authorId={session?.user.id ?? null}
      />
      <div className="flex flex-grow flex-col overflow-hidden">
        <textarea
          disabled={isLoading || !session}
          value={newTweet}
          onChange={(e) => setNewTweet(e.target.value)}
          rows={5}
          placeholder={placeholder}
          className={cn(
            'resize-x-none mb-4 flex-grow overscroll-contain text-white border-b border-gray-600 bg-transparent outline-none transition-colors placeholder:text-gray-600',
            isLoading && 'text-gray-600'
          )}
        />
        <div className="flex items-center space-x-4 self-end">
          <p className="text-sm text-gray-600">
            {newTweet.trim().length} / 255
          </p>
          <button
            className={cn(
              isLoading ? 'w-14' : 'w-20',
              'flex items-center justify-center rounded-full text-white bg-sky-500 py-1.5 font-bold transition-all duration-300 disabled:bg-gray-400 '
            )}
            disabled={!tweetButtonNotDisabled || isLoading || !session}
            onClick={() => postTweet()}
          >
            {isLoading ? (
              <Oval
                width={18}
                height={18}
                color="white"
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="white"
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
