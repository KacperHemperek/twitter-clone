'use client';

import { MAIN_FEED_QUERY_KEYS } from '@/app/feed/main/(components)/MainFeed';
import { useMutation } from '@tanstack/react-query';
import { HeartIcon, MessageCircleIcon, RefreshCwIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { memo } from 'react';

import { likeTweet } from '@/components/common/services/CommonService.service';

import AddCommentModal from '@/components/common/AddCommentModal';
import TweetUserInfo from '@/components/common/tweet-user-info/TweetUserInfo';

import { queryClient } from '../../context/Providers';
import TweetAvatar from '../TweetAvatar';

import { cn } from '@/lib/cn';
import {
  InfiniteQueryData,
  getUpdatedFeedWithNewLike,
} from '@/lib/infiniteQueryHelpers';
import { formatNumberToCompact } from '@/lib/shortNumberFormatter';

import { type Post } from '@/types/Post.type';

async function commentTweet(tweetBody: string, tweetId?: string) {
  const url = `/api/tweets/${tweetId}/comments`;

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ tweetBody }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(
      data?.message ?? 'Something went wrong while commenting on tweet'
    );
  }
}

function Tweet({ post, feedQueryKey }: { post: Post; feedQueryKey: string[] }) {
  const router = useRouter();
  const { data: session } = useSession();

  const { mutate: likeTweetMutation } = useMutation({
    mutationFn: async () => likeTweet(post.id),
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
    likeTweetMutation();
  };

  const goToTweetDetails = () => {
    router.push(`/tweet/${post.id}`);
  };

  const tweetIsLiked = post.likes.some(
    (like) => like.userId === session?.user.id
  );

  const tweetIsRetweeted = false;

  return (
    <AddCommentModal
      addComment={commentTweet}
      feedQueryKey={['comments', post.id]}
      tweet={post}
      onSuccess={() => {
        router.push(`/tweet/${post.id}`);
        queryClient.invalidateQueries(MAIN_FEED_QUERY_KEYS);
      }}
    >
      <>
        <div
          onClick={goToTweetDetails}
          className="flex cursor-pointer space-x-3 border-b border-gray-700 p-4 text-sm"
        >
          <TweetAvatar
            image={post.author.image}
            authorName={post.author.name}
            authorId={post.author.id}
          />
          <div className="flex-grow space-y-2">
            <TweetUserInfo
              authorEmail={post.author.email}
              authorName={post.author.name}
              createdAt={post.createdAt}
            />

            <p>{post.message}</p>
            <div className="grid grid-cols-3">
              <div>
                <button
                  className={cn(
                    tweetIsLiked ? 'text-pink-600' : 'text-gray-400',
                    'group flex cursor-pointer items-center transition-all hover:text-pink-400'
                  )}
                  onClick={onLikeTweet}
                >
                  <HeartIcon className="mr-4  h-4 w-4" />
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
                  <RefreshCwIcon className="mr-4  h-4 w-4" />
                  {formatNumberToCompact(13)}
                </button>
              </div>
              <div>
                <AddCommentModal.DialogTrigger
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className={
                    'group flex cursor-pointer items-center text-gray-400 transition-all hover:text-sky-500'
                  }
                >
                  <MessageCircleIcon className="mr-4  h-4 w-4" />
                  {formatNumberToCompact(post.comments?.length ?? 0)}
                </AddCommentModal.DialogTrigger>
              </div>
            </div>
          </div>
        </div>
        <AddCommentModal.Form />
      </>
    </AddCommentModal>
  );
}

export default memo(Tweet);
