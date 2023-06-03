'use client';

import TweetUserInfo from './tweet-user-info/TweetUserInfo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import NewTweetForm from '../feed/NewTweetForm/NewTweetForm';
import TweetAvatar from '../feed/TweetAvatar';

import { Post } from '@/types/Post.type';

type AddCommentModalContextType = {
  tweet: Post | null;
  addComment: (...args: any) => Promise<void>;
  onSuccess?: (...args: any) => void;
  feedQueryKey: string[];
};

const AddCommentModalContext = createContext<AddCommentModalContextType>({
  tweet: null,
  addComment: async (...args: any) => {},
  feedQueryKey: [],
});

type AddCommentModalProps = AddCommentModalContextType & {
  children: React.ReactNode;
};

export default function AddCommentModal(props: AddCommentModalProps) {
  return (
    <AddCommentModalContext.Provider value={{ ...props }}>
      <Dialog>{props.children}</Dialog>
    </AddCommentModalContext.Provider>
  );
}

function Form() {
  const { addComment, feedQueryKey, tweet, onSuccess } = useContext(
    AddCommentModalContext
  );

  return (
    <DialogContent className="border-0 gap-2 h-full sm:h-min">
      <div className="flex flex-col">
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <TweetAvatar
              authorName={tweet?.author.name || null}
              image={tweet?.author.image || null}
            />
            <div className="h-full w-0.5 bg-gray-400 my-2" />
          </div>
          <div className="flex flex-col ">
            <TweetUserInfo
              authorEmail={tweet?.author.email}
              authorName={tweet?.author.name}
              createdAt={tweet?.createdAt}
              alwaysShowShowInColumn={true}
            />
            <p className="mt-2 mb-4">{tweet?.message}</p>
            <p className="text-gray-400 text-sm mb-6">
              Replying to{' '}
              <Link
                className="text-sky-500"
                href={`/account/${tweet?.author.id}`}
              >
                {tweet?.author.email}
              </Link>
            </p>
          </div>
        </div>
        <NewTweetForm
          createTweet={addComment}
          onSuccessCallback={onSuccess}
          wrapperClassname="border-b-0 p-0"
          tweetId={tweet?.id}
          feedQueryKey={feedQueryKey}
        />
      </div>
    </DialogContent>
  );
}

AddCommentModal.Form = Form;

AddCommentModal.DialogTrigger = DialogTrigger;
