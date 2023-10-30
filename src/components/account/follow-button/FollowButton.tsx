import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

import { followUser } from '@/services/Account.service';

import LoginDialog from '@/components/common/LoginDialog';
import { queryClient } from '@/components/context/Providers';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

import { cn } from '@/lib/cn';

type FollowButtonProps = {
  isFollowing: boolean;
  queryKey: string[];
  userId: string;
  username: string;
};

export default function FollowButton({
  userId,
  queryKey,
  isFollowing,
  username,
}: FollowButtonProps) {
  const { mutate: followUserMutation, isLoading: followingUserLoading } =
    useMutation({
      mutationFn: async () => followUser(userId),
      mutationKey: ['followUser'],
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);

        if (dialogOpen) {
          setDialogOpen(false);
        }
      },
      onError: (err: any) => {
        toast({
          variant: 'destructive',
          title: 'Oh no!',
          description: err?.message ?? `We couldn't follow this user.`,
        });
        if (dialogOpen) {
          setDialogOpen(false);
        }
      },
    });

  const [hover, setHover] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: session } = useSession();

  function openUnfollowModalOrFollowUser() {
    if (isFollowing) {
      setDialogOpen(true);
    } else {
      followUserMutation();
    }
  }

  if (!session) {
    return (
      <LoginDialog
        trigger={
          <button
            className={cn(
              'px-4 py-1.5 rounded-full font-bold border-2 border-white disabled:bg-gray-400 disabled:border-gray-400 disabled:text-gray-600'
            )}
          >
            Follow
          </button>
        }
      />
    );
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {/* <DialogTrigger asChild> */}
      <button
        disabled={followingUserLoading}
        onClick={() => openUnfollowModalOrFollowUser()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={cn(
          '  px-4 py-1.5 rounded-full font-bold border-2 border-white disabled:bg-gray-400 disabled:border-gray-400 disabled:text-gray-600',
          isFollowing ? '' : 'bg-white active:bg-white/80  text-background',
          hover && isFollowing && 'border-red-500 text-red-500'
        )}
      >
        {isFollowing ? (hover ? 'Unfollow' : 'Following') : 'Follow'}
      </button>
      {dialogOpen && (
        <DialogContent className="border-none sm:max-w-[350px] h-full justify-start sm:justify-start flex flex-col sm:h-fit">
          <DialogHeader>
            <DialogTitle className="text-xl">Unfollow {username}?</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-base text-gray-600 mb-4">
            Their tweets will no longer show up in your home timeline. You will
            also not see their tweets in followed feed.
          </DialogDescription>
          <DialogFooter className="flex w-full gap-4 flex-col sm:flex-col space-x-0 sm:space-x-0">
            <button
              onClick={() => followUserMutation()}
              disabled={followingUserLoading}
              className={cn(
                'py-3 border-2 font-semibold m-0 rounded-full border-white bg-white text-background disabled:bg-gray-400 disabled:border-gray-400 disabled:text-gray-600'
              )}
            >
              Unfollow
            </button>
            <button
              disabled={followingUserLoading}
              onClick={() => setDialogOpen(false)}
              className="py-3 border-2 font-semibold m-0 rounded-full border-white disabled:border-gray-600 disabled:text-gray-600"
            >
              Cancel
            </button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
