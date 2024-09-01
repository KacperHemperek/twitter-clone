'use client';

import LikeButton from './LikeButtonDetails';
import { commentTweet, getTweetDetails } from '@/clients/tweets.client';
import { useQuery } from '@tanstack/react-query';
import { MessageCircleIcon, RefreshCwIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react';

import AddCommentModal from '@/components/common/AddCommentModal';
import LoginDialog from '@/components/common/LoginDialog';
import { TextWithLinks } from '@/components/common/TextWithLinks';
import TweetUserInfo from '@/components/common/tweet-user-info/TweetUserInfo';
import TweetActions from '@/components/feed/TweetActions';
import TweetAvatar from '@/components/feed/TweetAvatar';
import { RetweetButtonDetails } from '@/components/tweet-details/RetweetButtonDetails';

import { formatLongDate } from '@/lib/dateFormatters';

import { Tweet } from '@/types/Tweet.type';

export const getTweetDetailsQueryKey = (tweetId: string) => [
  'tweetDetails',
  tweetId,
];

export default function TweetDetails({
  tweetId,
  initialTweetDetails,
}: {
  tweetId: string;
  initialTweetDetails?: Tweet;
}) {
  const { data: tweetDetails } = useQuery({
    queryKey: getTweetDetailsQueryKey(tweetId),
    queryFn: async () => getTweetDetails(tweetId),
    initialData: initialTweetDetails,
  });

  const { data: session } = useSession();

  return (
    <AddCommentModal
      addComment={commentTweet}
      feedQueryKey={['comments']}
      tweet={tweetDetails}
    >
      <>
        <div className="flex flex-col p-4">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <TweetAvatar
                authorId={tweetDetails?.author.id ?? null}
                authorName={tweetDetails?.author.name ?? null}
                image={tweetDetails?.author.image ?? null}
              />
              <TweetUserInfo
                authorName={tweetDetails?.author.name}
                authorEmail={tweetDetails?.author.email}
                showDate={false}
                alwaysShowShowInColumn={true}
              />
            </div>
            <TweetActions
              authorId={tweetDetails?.author.id!}
              id={tweetDetails?.id!}
              tweetBody={tweetDetails?.message!}
            />
          </div>
          <div className="space-y-4 border-b border-gray-700 py-3.5">
            <TextWithLinks>
              <p className="text-lg overflow-break whitespace-pre-line">
                {tweetDetails?.message}
              </p>
            </TextWithLinks>
            <p className=" text-gray-400">
              {formatLongDate(new Date(tweetDetails?.createdAt ?? ''))}
            </p>
          </div>
          <div className="grid grid-cols-3 border-b border-gray-700 py-3.5">
            <div className="text-center">
              <span className="font-bold">{tweetDetails?.likes.length}</span>{' '}
              <span className="text-gray-500">likes</span>
            </div>
            <div className="text-center">
              <span className="font-bold">{tweetDetails?.retweets.length}</span>{' '}
              <span className="text-gray-500">retweets</span>
            </div>
            <div className="text-center">
              <span className="font-bold">
                {tweetDetails?.comments?.length}
              </span>{' '}
              <span className="text-gray-500">comments</span>
            </div>
          </div>
          <div className="grid grid-cols-3 border-b border-gray-700 py-3.5">
            <div className="flex justify-center">
              <LikeButton likes={tweetDetails?.likes ?? []} tweetId={tweetId} />
            </div>
            <div className="flex justify-center">
              <RetweetButtonDetails
                retweets={tweetDetails?.retweets ?? []}
                id={tweetDetails?.id ?? ''}
              />
            </div>
            <div className="flex justify-center">
              {session ? (
                <AddCommentModal.DialogTrigger className=" transition-all hover:text-sky-500">
                  <MessageCircleIcon className="h-5 w-5" />
                </AddCommentModal.DialogTrigger>
              ) : (
                <LoginDialog
                  trigger={
                    <button className="transition-all hover:text-sky-500">
                      <MessageCircleIcon className="h-5 w-5" />
                    </button>
                  }
                />
              )}
            </div>
          </div>
        </div>
        <AddCommentModal.Form />
      </>
    </AddCommentModal>
  );
}
