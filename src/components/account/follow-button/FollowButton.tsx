import { followUser } from '@/clients/account.client';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

import { ConfirmationDialog } from '@/components/common/ConfirmationDialog';
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

export enum FollowState {
  following = 'following',
  followedBy = 'followedBy',
}

type FollowButtonProps = {
  followState?: FollowState;
  queryKey: string[];
  userId: string;
  username: string;
};

export default function FollowButton({
  userId,
  queryKey,
  followState,
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

  const isFollowing = followState === FollowState.following;

  function openUnfollowModalOrFollowUser() {
    if (isFollowing) {
      setDialogOpen(true);
    } else {
      followUserMutation();
    }
  }

  function getButtonText({
    state,
    hovering,
  }: {
    state?: FollowState;
    hovering: boolean;
  }): string {
    if (state === FollowState.following) {
      return hovering ? 'Unfollow' : 'Following';
    }

    if (state === FollowState.followedBy) {
      return 'Follow Back';
    }

    return 'Follow';
  }

  const dialogMessage =
    'Their tweets will no longer show up in your home timeline. You will also not see their tweets in followed feed.';

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
    <>
      <ConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={`Unfollow ${username}?`}
        message={dialogMessage}
        trigger={
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
            {getButtonText({ state: followState, hovering: hover })}
          </button>
        }
        onCancel={() => setDialogOpen(false)}
        onConfirm={() => followUserMutation()}
        cancelDisabled={followingUserLoading}
        confirmDisabled={followingUserLoading}
        confirmLabel="Unfollow"
        cancelLabel="Cancel"
      />
    </>
  );
}
