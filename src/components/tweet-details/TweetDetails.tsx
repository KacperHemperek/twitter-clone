'use client';

import LikeButtonDetails from './LikeButtonDetails';
import { useQuery } from '@tanstack/react-query';
import { MessageCircleIcon, RefreshCwIcon } from 'lucide-react';
import React from 'react';

import { commentTweet, getTweetDetails } from '@/services/Tweets.service';

import AddCommentModal from '@/components/common/AddCommentModal';
import TweetUserInfo from '@/components/common/tweet-user-info/TweetUserInfo';
import TweetAvatar from '@/components/feed/TweetAvatar';

import { formatLongDate } from '@/lib/dateFormatters';

import { Tweet } from '@/types/Tweet.type';

export const getTweetDetailsQueryKey = (tweetId: string) => [
  'tweetDetails',
  tweetId,
];

export default function TweetDetails({
  tweetId,
  initialtweetDetails,
}: {
  tweetId: string;
  initialtweetDetails?: Tweet;
}) {
  const { data: tweetDetails } = useQuery({
    queryKey: getTweetDetailsQueryKey(tweetId),
    queryFn: async () => getTweetDetails(tweetId),
    initialData: initialtweetDetails,
  });

  return (
    <AddCommentModal
      addComment={commentTweet}
      feedQueryKey={['comments']}
      tweet={tweetDetails}
    >
      <>
        <div className="flex flex-col p-4">
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
          <div className="space-y-4 border-b border-gray-700 py-3.5">
            <p className="text-lg">{tweetDetails?.message}</p>
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
              <span className="font-bold">0</span>{' '}
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
              <LikeButtonDetails
                likes={tweetDetails?.likes ?? []}
                tweetId={tweetId}
              />
            </div>
            <div className="flex justify-center">
              <button className="transition-all hover:text-green-500">
                <RefreshCwIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-center">
              <AddCommentModal.DialogTrigger className=" transition-all hover:text-sky-500">
                <MessageCircleIcon className="h-5 w-5" />
              </AddCommentModal.DialogTrigger>
            </div>
          </div>
        </div>
        <AddCommentModal.Form />
      </>
    </AddCommentModal>
  );
}
