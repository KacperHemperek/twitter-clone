'use client';

import NewTweetForm from './new-tweet-form/NewTweetForm';
import TweetUserInfo from './tweet-user-info/TweetUserInfo';
import Link from 'next/link';
import React, { createContext, useContext, useState } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

import TweetAvatar from '../feed/TweetAvatar';

import { Tweet } from '@/types/Tweet.type';

type AddCommentModalContextType = {
  addComment: (...args: any) => Promise<void>;
  feedQueryKey: string[];
  setDialogIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess?: (...args: any) => void;
  tweet?: Tweet;
};

const AddCommentModalContext = createContext<AddCommentModalContextType>({
  addComment: async () => { },
  setDialogIsOpened: () => { },
  feedQueryKey: [],
});

type AddCommentModalProps = Omit<
  AddCommentModalContextType,
  'setDialogIsOpened'
> & {
  children: React.ReactNode;
};

export default function AddCommentModal(props: AddCommentModalProps) {
  const [dialogIsOpened, setDialogIsOpened] = useState(false);

  return (
    <AddCommentModalContext.Provider value={{ ...props, setDialogIsOpened }}>
      <Dialog open={dialogIsOpened} onOpenChange={setDialogIsOpened}>
        {props.children}
      </Dialog>
    </AddCommentModalContext.Provider>
  );
}

function Form() {
  const { addComment, feedQueryKey, tweet, onSuccess, setDialogIsOpened } =
    useContext(AddCommentModalContext);

  return (
    <DialogContent className="border-0 gap-2 h-[100dvh] sm:h-min">
      <div className="flex flex-col">
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <TweetAvatar
              authorName={tweet?.author.name ?? null}
              image={tweet?.author.image}
              authorId={tweet?.author.id ?? null}
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
                href={`/account/${tweet?.author.id}/tweets`}
              >
                {tweet?.author.email}
              </Link>
            </p>
          </div>
        </div>
        <NewTweetForm
          createTweet={addComment}
          onSuccessCallback={() => {
            setDialogIsOpened(false);
            onSuccess && onSuccess();
          }}
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
