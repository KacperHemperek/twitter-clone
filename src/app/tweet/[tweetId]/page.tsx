import TweetUserInfo from '@/components/common/TweetHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Post } from '@/types/Post.type';
import { HeartIcon, MessageCircleIcon, RefreshCwIcon } from 'lucide-react';
import React from 'react';

async function getTweetDetails(tweetId: string): Promise<Post> {
  const url = `${process.env.NEXTAUTH_URL}/api/posts/${tweetId}`;

  const tweetDetailsRes = await fetch(url);

  const tweetDetails = await tweetDetailsRes.json();

  return tweetDetails;
}

export default async function TweetDetails({
  params,
}: {
  params: { tweetId: string };
}) {
  const tweetDetails = await getTweetDetails(params.tweetId);

  return (
    <>
      <div className='flex gap-2'>
        <Avatar>
          <AvatarImage src={tweetDetails?.author.image ?? undefined} />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        <TweetUserInfo
          authorName={tweetDetails?.author.name}
          authorEmail={tweetDetails?.author.email}
          showDate={false}
        />
      </div>
      <div className='space-y-4 border-b border-gray-700 py-3.5'>
        <p className='text-lg'>{tweetDetails?.message}</p>
        <p className=' text-gray-500'>
          {/* {formatTweetDate(new Date(createdAt))} */}
          {new Date(tweetDetails.createdAt).getTime()}
        </p>
      </div>
      <div className='grid grid-cols-3 border-b border-gray-700 py-3.5'>
        <div className='text-center'>
          <span className='font-bold'>{tweetDetails.likes.length}</span>{' '}
          <span className='text-gray-500'>likes</span>
        </div>
        <div className='text-center'>
          <span className='font-bold'>0</span>{' '}
          <span className='text-gray-500'>retweets</span>
        </div>
        <div className='text-center'>
          <span className='font-bold'>0</span>{' '}
          <span className='text-gray-500'>comments</span>
        </div>
      </div>
      <div className='grid grid-cols-3 border-b border-gray-700 py-3.5'>
        <div className='flex justify-center'>
          <button className=' transition-all hover:text-pink-500'>
            <HeartIcon className='h-5 w-5' />
          </button>
        </div>
        <div className='flex justify-center'>
          <button className='transition-all hover:text-green-500'>
            <RefreshCwIcon className='h-5 w-5' />
          </button>
        </div>
        <div className='flex justify-center'>
          <button className=' transition-all hover:text-sky-500'>
            <MessageCircleIcon className='h-5 w-5' />
          </button>
        </div>
      </div>
    </>
  );
}
