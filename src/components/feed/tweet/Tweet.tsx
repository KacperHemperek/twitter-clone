'use client';

import { MAIN_FEED_QUERY_KEYS } from '@/app/feed/main/(components)/MainFeed';
import { useMutation } from '@tanstack/react-query';
import { HeartIcon, MessageCircleIcon, RefreshCwIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { memo } from 'react';

import { commentTweet, likeTweet, retweet } from '@/services/Tweets.service';

import AddCommentModal from '@/components/common/AddCommentModal';
import TweetUserInfo from '@/components/common/tweet-user-info/TweetUserInfo';

import { queryClient } from '../../context/Providers';
import TweetAvatar from '../TweetAvatar';

import { cn } from '@/lib/cn';
import {
  InfiniteQueryData,
  getUpdatedFeedWithNewLike,
  getUpdatedFeedWithNewRetweet,
} from '@/lib/infiniteQueryHelpers';
import { formatNumberToCompact } from '@/lib/shortNumberFormatter';

import { type Tweet } from '@/types/Tweet.type';
import { toast } from '@/components/ui/use-toast';
import { TextWithLinks } from '@/components/common/TextWithLinks';
import TweetActions from '@/components/feed/TweetActions';
import { getAccountOnlyFeedQueryKey } from '@/components/account/account-only-feed/AccountOnlyFeed';
import LoginDialog from '@/components/common/LoginDialog';


function Tweet({ post, feedQueryKey }: { post: Tweet; feedQueryKey: string[] }) {
  const router = useRouter();
  const { data: session } = useSession();

  const { mutate: likeTweetMutation, isLoading: likingTweet } = useMutation({
    mutationFn: async () => likeTweet(post.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: feedQueryKey });

      const feed =
        queryClient.getQueryData<InfiniteQueryData<Tweet>>(feedQueryKey);

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

  const {mutate: retweetMutation, isLoading: retweeting} = useMutation({
    mutationFn: async () => retweet(post.id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: feedQueryKey });

      const feed =
        queryClient.getQueryData<InfiniteQueryData<Tweet>>(feedQueryKey);

      if (!feed || !session?.user.id) {
        return { feed };
      }

      const updatedFeed = getUpdatedFeedWithNewRetweet(
        feed,
        post,
        tweetIsRetweeted,
        session.user.id
      );

      queryClient.setQueryData<InfiniteQueryData<Tweet>>(feedQueryKey, { pageParams: feed.pageParams, pages: updatedFeed });

      return { feed };
    },
    onError: (error: any, _vars, context) => {
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description:
          error?.message ??
          `We couldn't retweet this tweet. Please try again later.`,
      });
      if (context?.feed) {
        queryClient.setQueryData(feedQueryKey, context.feed);
      }
    },
    onSuccess: () => {
      session?.user.id && queryClient.invalidateQueries(getAccountOnlyFeedQueryKey(session.user.id))
    }
  })

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

  const tweetIsRetweeted = post.retweets.some(
    (retweet) => retweet.userId === session?.user.id
  );


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
         className="flex cursor-pointer space-x-3 border-b border-gray-700 p-4 text-sm group"
        >
          <TweetAvatar
            image={post.author.image}
            authorName={post.author.name}
            authorId={post.author.id}
          />
          <div className="flex flex-col w-full space-y-2 overflow-hidden">
            <div className='flex justify-between overflow-hidden'>
              <div className='flex flex-col overflow-hidden'>
                {!!post.retweetedBy && 
                  <div className='text-gray-600 text-sm mb-2 flex items-center overflow-hidden'>
                    <RefreshCwIcon className='max-w-3 max-h-3 min-w-fit text-gray-600 mr-1' />
                    <span className="truncate min-w-0">
                      Retweeted by{' '}
                      {post.retweetedBy.userId === session?.user.id ? 'You' : post.retweetedBy.name}
                    </span>
                  </div>
                }
                <TweetUserInfo
                  authorEmail={post.author.email}
                  authorName={post.author.name}
                  createdAt={post.createdAt}
                />
              </div>
              <TweetActions 
                id={post.id}
                queryKey={feedQueryKey}
                tweetBody={post.message}
                authorId={post.author.id}
              />
            </div>


            <TextWithLinks>
              <p className='overflow-break whitespace-pre-line'>{post.message}</p>
            </TextWithLinks>
            <div className="grid grid-cols-3">
              <div>
              {
                  !session ? (
                    <LoginDialog 
                      trigger={
                        <button
                         onClick={e => e.stopPropagation()}
                         className='text-gray-400 group flex cursor-pointer items-center transition-all hover:text-pink-400'
                        >
                          <HeartIcon className="mr-4  h-4 w-4" />
                          {formatNumberToCompact(post.likes.length)}
                        </button>
                      } 
                    />
                  ) : (
                    <button
                      disabled={likingTweet}
                      className={cn(
                        tweetIsLiked ? 'text-pink-600' : 'text-gray-400',
                        'group flex cursor-pointer items-center transition-all hover:text-pink-400'
                      )}
                      onClick={onLikeTweet}
                    >
                      <HeartIcon className="mr-2 md:mr-4 h-4 w-4" />
                      {formatNumberToCompact(post.likes.length)}
                    </button>    
                  )
                }
                
              </div>
              <div>
                {
                  !session ? (
                    <LoginDialog 
                      trigger={
                        <button 
                          onClick={e => e.stopPropagation()}
                          className='text-gray-400 group flex cursor-pointer items-center transition-all hover:text-green-400' 
                        >
                          <RefreshCwIcon className="mr-2 md:mr-4  h-4 w-4" />
                          {formatNumberToCompact(post.retweets.length)}
                        </button>
                      } 
                    />
                  ) : (
                    <button
                      onClick ={(e) => {
                        e.stopPropagation(); 
                        retweetMutation();
                      }}
                      disabled={retweeting}
                      className={cn(
                        tweetIsRetweeted ? 'text-green-500' : 'text-gray-400',
                        'group flex cursor-pointer items-center transition-all hover:text-green-400'
                      )}
                    >
                      <RefreshCwIcon className="mr-2 md:mr-4  h-4 w-4" />
                      {formatNumberToCompact(post.retweets.length)}
                    
                    </button>
                  )
                }
                
              </div>
              <div>
                {!session ? (
                  <LoginDialog trigger={
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className='group flex cursor-pointer items-center text-gray-400 transition-all hover:text-sky-500'
                    >
                      <MessageCircleIcon className="mr-2 md:mr-4 h-4 w-4" />  
                      {formatNumberToCompact(post.comments?.length ?? 0)}
                    </button>
                  }/>
                ) : (
                  <AddCommentModal.DialogTrigger
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={
                      'group flex cursor-pointer items-center text-gray-400 transition-all hover:text-sky-500'
                    }
                  >
                    <MessageCircleIcon className="mr-2 md:mr-4 h-4 w-4" />
                    {formatNumberToCompact(post.comments?.length ?? 0)}
                  </AddCommentModal.DialogTrigger>
                )}
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
