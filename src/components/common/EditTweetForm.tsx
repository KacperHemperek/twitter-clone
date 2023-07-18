import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { Oval } from 'react-loader-spinner';

import { editTweet } from '@/services/Tweets.service';

import { queryClient } from '@/components/context/Providers';
import TweetAvatar from '@/components/feed/TweetAvatar';
import { getTweetDetailsQueryKey } from '@/components/tweet-details/TweetDetails';
import { DialogContent } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

import { cn } from '@/lib/cn';

import { ErrorResponse } from '@/types/api/error';

export function EditTweetForm({
  id,
  initialMessage,
  closeDialog,
  queryKey,
}: {
  id: string;
  initialMessage: string;
  queryKey?: string[];
  closeDialog: () => void;
}) {
  const [tweetMessage, setTweetMessage] = useState(initialMessage);
  const { data: session } = useSession();
  const router = useRouter();

  const tweetButtonNotDisabled = useMemo(
    () => tweetMessage.trim().length <= 256 && tweetMessage.trim().length > 0,
    [tweetMessage]
  );

  const { mutate: editTweetMutation, isLoading } = useMutation({
    mutationFn: async () => editTweet({ message: tweetMessage, id }),
    onSuccess: () => {
      queryKey && queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(getTweetDetailsQueryKey(id));
      closeDialog();
      router.push(`/tweet/${id}`);
    },
    onError: (error: any) => {
      const { cause } = error.cause as ErrorResponse;
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: cause,
      });
    },
  });

  return (
    <DialogContent
      className="border-0 gap-2 h-[100dvh] sm:h-min"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col">
        <div className="flex space-x-3 pt-4">
          <TweetAvatar
            image={session?.user.image ?? null}
            authorName={session?.user.name ?? null}
            authorId={session?.user.id ?? null}
          />
          <div className="flex flex-grow flex-col">
            <textarea
              value={tweetMessage}
              onChange={(e) => setTweetMessage(e.target.value)}
              rows={3}
              className={cn(
                'resize-x-none mb-4 flex-grow overscroll-contain text-white border-b border-gray-600 bg-transparent text-xl outline-none transition-colors placeholder:text-gray-600',
                isLoading && 'text-gray-600'
              )}
            />
            <div className="flex items-center space-x-4 self-end">
              <p className="text-sm text-gray-600">
                {tweetMessage.trim().length} / 255
              </p>
              <button
                className={
                  'flex items-center justify-center rounded-full text-white bg-transparent py-1.5 font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-white w-[88px]'
                }
                disabled={isLoading}
                onClick={closeDialog}
              >
                Cancel
              </button>
              <button
                className={cn(
                  isLoading ? 'w-14' : 'w-20',
                  'flex items-center justify-center rounded-full text-white bg-sky-500 py-1.5 font-bold transition-all duration-300 disabled:bg-gray-400  border-2 border-sky-500 disabled:border-gray-400'
                )}
                disabled={!tweetButtonNotDisabled || isLoading}
                onClick={() => editTweetMutation()}
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
      </div>
    </DialogContent>
  );
}
